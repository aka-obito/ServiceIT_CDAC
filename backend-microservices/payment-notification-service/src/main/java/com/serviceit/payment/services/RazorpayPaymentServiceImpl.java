package com.serviceit.payment.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.serviceit.payment.dtos.EmailNotificationRequestDTO;
import com.serviceit.payment.dtos.PaymentOrderRequestDTO;
import com.serviceit.payment.dtos.PaymentOrderResponseDTO;
import com.serviceit.payment.dtos.PaymentResponseDTO;
import com.serviceit.payment.dtos.PaymentVerifyRequestDTO;
import com.serviceit.payment.entities.Payment;
import com.serviceit.payment.entities.PaymentMode;
import com.serviceit.payment.entities.PaymentStatus;
import com.serviceit.payment.exceptions.InvalidOperationException;
import com.serviceit.payment.exceptions.ResourceNotFoundException;
import com.serviceit.payment.feign.BookingServiceClient;
import com.serviceit.payment.repositories.PaymentRepository;

@Service
@Transactional
public class RazorpayPaymentServiceImpl implements RazorpayPaymentService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentServiceImpl.class);

    private final PaymentRepository paymentRepository;
    private final BookingServiceClient bookingServiceClient;
    private final EmailService emailService;
    private final ModelMapper modelMapper;

    @Value("${razorpay.key.id:rzp_test_N5xLp7V4aB3cDe}")
    private String keyId;

    @Value("${razorpay.key.secret:9xK8mP2vL4qW7zR1tY6uI3oP}")
    private String keySecret;

    public RazorpayPaymentServiceImpl(PaymentRepository paymentRepository,
                                     BookingServiceClient bookingServiceClient,
                                     EmailService emailService,
                                     ModelMapper modelMapper) {
        this.paymentRepository = paymentRepository;
        this.bookingServiceClient = bookingServiceClient;
        this.emailService = emailService;
        this.modelMapper = modelMapper;
    }

    @Override
    public PaymentOrderResponseDTO createOrder(PaymentOrderRequestDTO request) {
        BookingServiceClient.BookingDTO booking = bookingServiceClient.getBookingById(request.getBookingId());
        if (booking == null) {
            throw new ResourceNotFoundException("Booking not found with id: " + request.getBookingId());
        }

        try {
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
            JSONObject orderRequest = new JSONObject();
            // Razorpay amount in paise (₹1 = 100 paise)
            orderRequest.put("amount", booking.getTotalAmount().multiply(BigDecimal.valueOf(100)).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + booking.getBookingId());

            Order order = razorpay.orders.create(orderRequest);
            String razorpayOrderId = order.get("id");

            Payment payment = paymentRepository.findByBookingId(booking.getBookingId())
                    .orElse(new Payment(booking.getBookingId(), booking.getTotalAmount(), razorpayOrderId));

            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setPaymentStatus(PaymentStatus.PENDING);
            paymentRepository.save(payment);

            return PaymentOrderResponseDTO.builder()
                    .razorpayOrderId(razorpayOrderId)
                    .amount(booking.getTotalAmount())
                    .currency("INR")
                    .razorpayKeyId(keyId)
                    .bookingId(booking.getBookingId())
                    .build();

        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order: {}", e.getMessage());
            throw new InvalidOperationException("Failed to initiate Razorpay order: " + e.getMessage());
        }
    }

    @Override
    public PaymentResponseDTO verifyPayment(PaymentVerifyRequestDTO request) {
        Payment payment = paymentRepository.findByBookingId(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for booking id: " + request.getBookingId()));

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = Utils.verifyPaymentSignature(options, keySecret);
            if (!isValid) {
                payment.setPaymentStatus(PaymentStatus.FAILED);
                paymentRepository.save(payment);
                throw new InvalidOperationException("Payment signature verification failed.");
            }

            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setRazorpaySignature(request.getRazorpaySignature());
            payment.setPaymentStatus(PaymentStatus.COMPLETED);
            payment.setPaymentDate(LocalDateTime.now());
            Payment saved = paymentRepository.save(payment);

            // 1. Inter-Service Call: Confirm booking status in booking-catalog-service
            bookingServiceClient.confirmBookingPayment(request.getBookingId());

            // 2. Fetch booking details to send emails
            BookingServiceClient.BookingDTO booking = bookingServiceClient.getBookingById(request.getBookingId());
            if (booking != null) {
                // Email to Consumer
                if (booking.getConsumerEmail() != null) {
                    emailService.handleNotification(EmailNotificationRequestDTO.builder()
                            .type("BOOKING_CONFIRMATION")
                            .to(booking.getConsumerEmail())
                            .fullName(booking.getConsumerName())
                            .serviceName(booking.getServiceName())
                            .serviceDate(String.valueOf(booking.getServiceDate()))
                            .serviceTime(String.valueOf(booking.getServiceTime()))
                            .serviceAddress(booking.getServiceAddress())
                            .build());
                }

                // Email to Provider
                if (booking.getProviderEmail() != null) {
                    emailService.handleNotification(EmailNotificationRequestDTO.builder()
                            .type("PROVIDER_ALERT")
                            .to(booking.getProviderEmail())
                            .fullName(booking.getProviderName())
                            .consumerName(booking.getConsumerName())
                            .serviceName(booking.getServiceName())
                            .serviceDate(String.valueOf(booking.getServiceDate()))
                            .serviceTime(String.valueOf(booking.getServiceTime()))
                            .serviceAddress(booking.getServiceAddress())
                            .build());
                }
            }

            return mapToDTO(saved);

        } catch (RazorpayException e) {
            log.error("Razorpay verification error: {}", e.getMessage());
            throw new InvalidOperationException("Error verifying payment signature: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDTO getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking id: " + bookingId));
        return mapToDTO(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private PaymentResponseDTO mapToDTO(Payment payment) {
        PaymentResponseDTO dto = modelMapper.map(payment, PaymentResponseDTO.class);
        dto.setPaymentId(payment.getId());
        return dto;
    }
}
