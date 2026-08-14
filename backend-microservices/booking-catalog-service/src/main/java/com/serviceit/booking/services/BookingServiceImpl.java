package com.serviceit.booking.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.serviceit.booking.dtos.BookingCreateRequestDTO;
import com.serviceit.booking.dtos.BookingResponseDTO;
import com.serviceit.booking.dtos.BookingStatusUpdateDTO;
import com.serviceit.booking.entities.Booking;
import com.serviceit.booking.entities.BookingStatus;
import com.serviceit.booking.entities.ProviderService;
import com.serviceit.booking.exceptions.InvalidOperationException;
import com.serviceit.booking.exceptions.ResourceNotFoundException;
import com.serviceit.booking.feign.NotificationServiceClient;
import com.serviceit.booking.feign.dto.EmailNotificationRequestDTO;
import com.serviceit.booking.repositories.BookingRepository;
import com.serviceit.booking.repositories.ProviderServiceRepository;
import com.serviceit.booking.security.SecurityUtils;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingServiceImpl.class);

    private final BookingRepository bookingRepository;
    private final ProviderServiceRepository providerServiceRepository;
    private final AuditLogService auditLogService;
    private final NotificationServiceClient notificationServiceClient;
    private final SecurityUtils securityUtils;

    private static final LocalTime WORK_START = LocalTime.of(8, 0);   // 08:00 AM
    private static final LocalTime WORK_END = LocalTime.of(22, 0);    // 10:00 PM
    private static final int BUFFER_MINUTES = 60;                    // 1-hour buffer

    public BookingServiceImpl(BookingRepository bookingRepository,
                              ProviderServiceRepository providerServiceRepository,
                              AuditLogService auditLogService,
                              NotificationServiceClient notificationServiceClient,
                              SecurityUtils securityUtils) {
        this.bookingRepository = bookingRepository;
        this.providerServiceRepository = providerServiceRepository;
        this.auditLogService = auditLogService;
        this.notificationServiceClient = notificationServiceClient;
        this.securityUtils = securityUtils;
    }

    @Override
    public BookingResponseDTO createBooking(BookingCreateRequestDTO createRequest) {
        Long consumerUserId = securityUtils.getCurrentUserId();
        String consumerName = securityUtils.getCurrentUserFullName();
        String consumerEmail = securityUtils.getCurrentUserEmail();
        Long consumerId = consumerUserId;

        ProviderService providerService = providerServiceRepository.findById(createRequest.getProviderServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider service not found with id: " + createRequest.getProviderServiceId()));

        if (!providerService.isAvailable()) {
            throw new InvalidOperationException("This service is currently unavailable for booking.");
        }

        if (providerService.getProviderUserId().equals(consumerUserId)) {
            throw new InvalidOperationException("You cannot book your own service.");
        }

        LocalDate reqDate = createRequest.getServiceDate();
        LocalTime reqStartTime = createRequest.getServiceTime();
        int reqDurationMinutes = providerService.getEstimatedDuration() != null ? providerService.getEstimatedDuration() : 60;
        LocalTime reqEndTime = reqStartTime.plusMinutes(reqDurationMinutes);

        // 1. Operating Hours Check (08:00 AM to 10:00 PM)
        if (reqStartTime.isBefore(WORK_START) || reqStartTime.isAfter(WORK_END)) {
            throw new InvalidOperationException(
                    "Bookings can only be scheduled within working hours (08:00 AM to 10:00 PM). Selected time: " +
                    reqStartTime.format(DateTimeFormatter.ofPattern("hh:mm a")));
        }

        if (reqEndTime.isAfter(WORK_END) || (reqEndTime.isBefore(reqStartTime) && !reqEndTime.equals(LocalTime.MIDNIGHT))) {
            throw new InvalidOperationException(
                    "Service duration (" + reqDurationMinutes + " mins) extends beyond working hours (10:00 PM). Please select an earlier time slot.");
        }

        // 2. Prevent past bookings on today's date
        if (reqDate.equals(LocalDate.now()) && reqStartTime.isBefore(LocalTime.now())) {
            throw new InvalidOperationException("Cannot schedule a booking in the past. Please select a future time slot.");
        }

        // 3. Provider Schedule & 1-Hour Buffer Check
        Long providerId = providerService.getProviderId();
        List<Booking> providerBookings = bookingRepository
                .findByProviderService_ProviderIdAndServiceDateAndBookingStatusNot(
                        providerId, reqDate, BookingStatus.CANCELLED);

        LocalTime reqBlockedEnd = reqEndTime.plusMinutes(BUFFER_MINUTES);

        for (Booking existing : providerBookings) {
            int existDuration = existing.getProviderService().getEstimatedDuration() != null ?
                    existing.getProviderService().getEstimatedDuration() : 60;
            LocalTime existStart = existing.getServiceTime();
            LocalTime existEnd = existStart.plusMinutes(existDuration);
            LocalTime existBlockedEnd = existEnd.plusMinutes(BUFFER_MINUTES);

            boolean overlap = (reqStartTime.isBefore(existBlockedEnd) && reqBlockedEnd.isAfter(existStart));
            if (overlap) {
                DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("hh:mm a");
                throw new InvalidOperationException(
                        "The service provider is busy or traveling during this time window. Existing booking from " +
                        existStart.format(timeFmt) + " to " + existEnd.format(timeFmt) +
                        " (requires 1-hr buffer until " + existBlockedEnd.format(timeFmt) + "). Please select another slot.");
            }
        }

        // 4. Consumer Double-Booking Check
        List<Booking> consumerBookings = bookingRepository
                .findByConsumerIdAndServiceDateAndBookingStatusNot(
                        consumerId, reqDate, BookingStatus.CANCELLED);

        for (Booking existing : consumerBookings) {
            int existDuration = existing.getProviderService().getEstimatedDuration() != null ?
                    existing.getProviderService().getEstimatedDuration() : 60;
            LocalTime existStart = existing.getServiceTime();
            LocalTime existEnd = existStart.plusMinutes(existDuration);

            boolean overlap = (reqStartTime.isBefore(existEnd) && reqEndTime.isAfter(existStart));
            if (overlap) {
                DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("hh:mm a");
                throw new InvalidOperationException(
                        "You already have another active booking (" + existing.getProviderService().getService().getServiceName() +
                        ") scheduled from " + existStart.format(timeFmt) + " to " + existEnd.format(timeFmt) +
                        " on this date. Please pick a non-overlapping time.");
            }
        }

        Booking booking = new Booking(
                consumerId,
                consumerUserId,
                consumerName,
                consumerEmail,
                providerService,
                reqDate,
                reqStartTime,
                providerService.getPrice(),
                createRequest.getServiceAddress(),
                createRequest.getSpecialInstructions()
        );

        Booking saved = bookingRepository.save(booking);

        auditLogService.log("BOOKING_CREATED", consumerEmail, "CONSUMER",
                "Booking", saved.getId(), "Booking created for service: " + providerService.getService().getServiceName());

        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        return mapToDTO(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getMyConsumerBookings() {
        Long consumerUserId = securityUtils.getCurrentUserId();
        return bookingRepository.findByConsumerId(consumerUserId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getMyProviderBookings() {
        Long providerUserId = securityUtils.getCurrentUserId();
        return bookingRepository.findByProviderService_ProviderId(providerUserId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponseDTO updateBookingStatus(Long bookingId, BookingStatusUpdateDTO statusUpdateDTO) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        BookingStatus previousStatus = booking.getBookingStatus();
        booking.setBookingStatus(statusUpdateDTO.getStatus());
        Booking updated = bookingRepository.save(booking);

        auditLogService.log("BOOKING_STATUS_UPDATED", securityUtils.getCurrentUserEmail(), securityUtils.getCurrentUserRole(),
                "Booking", updated.getId(), "Changed status from " + previousStatus + " to " + statusUpdateDTO.getStatus());

        // Send service completion email via Notification Microservice
        if (previousStatus != BookingStatus.COMPLETED && statusUpdateDTO.getStatus() == BookingStatus.COMPLETED) {
            try {
                notificationServiceClient.sendEmail(EmailNotificationRequestDTO.builder()
                        .type("SERVICE_COMPLETED")
                        .to(booking.getConsumerEmail())
                        .fullName(booking.getConsumerName())
                        .serviceName(booking.getProviderService().getService().getServiceName())
                        .build());
            } catch (Exception e) {
                log.warn("Could not dispatch async service completion email: {}", e.getMessage());
            }
        }

        return mapToDTO(updated);
    }

    @Override
    public BookingResponseDTO cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getBookingStatus() == BookingStatus.COMPLETED) {
            throw new InvalidOperationException("Cannot cancel an already completed booking.");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);

        auditLogService.log("BOOKING_CANCELLED", securityUtils.getCurrentUserEmail(), securityUtils.getCurrentUserRole(),
                "Booking", updated.getId(), "Booking #" + updated.getId() + " cancelled");

        String serviceName = (booking.getProviderService() != null && booking.getProviderService().getService() != null)
                ? booking.getProviderService().getService().getServiceName() : "Service";

        // 1. Send cancellation email to Consumer
        if (booking.getConsumerEmail() != null) {
            try {
                notificationServiceClient.sendEmail(EmailNotificationRequestDTO.builder()
                        .type("BOOKING_CANCELLED_CONSUMER")
                        .to(booking.getConsumerEmail())
                        .fullName(booking.getConsumerName())
                        .serviceName(serviceName)
                        .serviceDate(String.valueOf(booking.getServiceDate()))
                        .serviceTime(String.valueOf(booking.getServiceTime()))
                        .build());
            } catch (Exception e) {
                log.warn("Could not dispatch async cancel email to consumer: {}", e.getMessage());
            }
        }

        // 2. Send cancellation email to Provider
        if (booking.getProviderService() != null && booking.getProviderService().getProviderEmail() != null) {
            try {
                notificationServiceClient.sendEmail(EmailNotificationRequestDTO.builder()
                        .type("BOOKING_CANCELLED_PROVIDER")
                        .to(booking.getProviderService().getProviderEmail())
                        .fullName(booking.getProviderService().getProviderName())
                        .consumerName(booking.getConsumerName())
                        .serviceName(serviceName)
                        .serviceDate(String.valueOf(booking.getServiceDate()))
                        .serviceTime(String.valueOf(booking.getServiceTime()))
                        .build());
            } catch (Exception e) {
                log.warn("Could not dispatch async cancel email to provider: {}", e.getMessage());
            }
        }

        return mapToDTO(updated);
    }

    @Override
    public void confirmBookingPayment(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        booking.setBookingStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        String userEmail = booking.getConsumerEmail() != null ? booking.getConsumerEmail() : "CONSUMER";
        String serviceName = (booking.getProviderService() != null && booking.getProviderService().getService() != null)
                ? booking.getProviderService().getService().getServiceName() : "Service";

        auditLogService.log("BOOKING_CONFIRMED", userEmail, "CONSUMER",
                "Booking", booking.getId(), "Booking #" + booking.getId() + " confirmed for " + serviceName + " (Paid via Razorpay)");
    }

    private BookingResponseDTO mapToDTO(Booking b) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(b.getId());
        dto.setConsumerId(b.getConsumerId());
        dto.setConsumerUserId(b.getConsumerUserId());
        dto.setConsumerName(b.getConsumerName());
        dto.setConsumerEmail(b.getConsumerEmail());
        dto.setProviderId(b.getProviderService().getProviderId());
        dto.setProviderUserId(b.getProviderService().getProviderUserId());
        dto.setProviderName(b.getProviderService().getProviderName());
        dto.setProviderEmail(b.getProviderService().getProviderEmail());
        dto.setServiceId(b.getProviderService().getService().getId());
        dto.setServiceName(b.getProviderService().getService().getServiceName());
        dto.setEstimatedDuration(b.getProviderService().getEstimatedDuration());
        dto.setServiceDate(b.getServiceDate());
        dto.setServiceTime(b.getServiceTime());
        dto.setBookingStatus(b.getBookingStatus());
        dto.setTotalAmount(b.getTotalAmount());
        dto.setServiceAddress(b.getServiceAddress());
        dto.setSpecialInstructions(b.getSpecialInstructions());
        dto.setCreatedOn(b.getCreatedOn());
        return dto;
    }
}
