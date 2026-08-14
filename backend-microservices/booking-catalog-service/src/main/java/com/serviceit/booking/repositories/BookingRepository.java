package com.serviceit.booking.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.serviceit.booking.entities.Booking;
import com.serviceit.booking.entities.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByConsumerId(Long consumerId);

    List<Booking> findByProviderService_ProviderId(Long providerId);

    List<Booking> findByBookingStatus(BookingStatus bookingStatus);

    List<Booking> findByProviderService_ProviderIdAndServiceDateAndBookingStatusNot(
            Long providerId, LocalDate serviceDate, BookingStatus excludedStatus);

    List<Booking> findByConsumerIdAndServiceDateAndBookingStatusNot(
            Long consumerId, LocalDate serviceDate, BookingStatus excludedStatus);
}
