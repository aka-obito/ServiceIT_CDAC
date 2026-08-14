package com.serviceit.booking.services;

import java.util.List;
import com.serviceit.booking.dtos.BookingCreateRequestDTO;
import com.serviceit.booking.dtos.BookingResponseDTO;
import com.serviceit.booking.dtos.BookingStatusUpdateDTO;

public interface BookingService {

    BookingResponseDTO createBooking(BookingCreateRequestDTO createRequest);

    BookingResponseDTO getBookingById(Long bookingId);

    List<BookingResponseDTO> getMyConsumerBookings();

    List<BookingResponseDTO> getMyProviderBookings();

    List<BookingResponseDTO> getAllBookings();

    BookingResponseDTO updateBookingStatus(Long bookingId, BookingStatusUpdateDTO statusUpdateDTO);

    BookingResponseDTO cancelBooking(Long bookingId);

    void confirmBookingPayment(Long bookingId);
}
