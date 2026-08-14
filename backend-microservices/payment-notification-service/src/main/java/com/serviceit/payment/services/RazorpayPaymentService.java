package com.serviceit.payment.services;

import java.util.List;
import com.serviceit.payment.dtos.PaymentOrderRequestDTO;
import com.serviceit.payment.dtos.PaymentOrderResponseDTO;
import com.serviceit.payment.dtos.PaymentResponseDTO;
import com.serviceit.payment.dtos.PaymentVerifyRequestDTO;

public interface RazorpayPaymentService {

    PaymentOrderResponseDTO createOrder(PaymentOrderRequestDTO request);

    PaymentResponseDTO verifyPayment(PaymentVerifyRequestDTO request);

    PaymentResponseDTO getPaymentByBookingId(Long bookingId);

    List<PaymentResponseDTO> getAllPayments();
}
