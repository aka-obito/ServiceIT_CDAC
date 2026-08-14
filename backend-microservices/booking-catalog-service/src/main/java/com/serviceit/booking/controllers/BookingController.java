package com.serviceit.booking.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.serviceit.booking.dtos.BookingCreateRequestDTO;
import com.serviceit.booking.dtos.BookingResponseDTO;
import com.serviceit.booking.dtos.BookingStatusUpdateDTO;
import com.serviceit.booking.services.BookingService;

import jakarta.validation.Valid;

@RestController
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/api/bookings")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingCreateRequestDTO createRequest) {
        BookingResponseDTO response = bookingService.createBooking(createRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/bookings/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable("id") Long id) {
        BookingResponseDTO response = bookingService.getBookingById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/bookings/consumer/my-bookings")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<List<BookingResponseDTO>> getMyConsumerBookings() {
        List<BookingResponseDTO> response = bookingService.getMyConsumerBookings();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/bookings/provider/my-bookings")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<List<BookingResponseDTO>> getMyProviderBookings() {
        List<BookingResponseDTO> response = bookingService.getMyProviderBookings();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookingsAdmin() {
        List<BookingResponseDTO> response = bookingService.getAllBookings();
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/api/bookings/{id}/status")
    @PreAuthorize("hasAnyRole('PROVIDER', 'ADMIN')")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable("id") Long id,
            @Valid @RequestBody BookingStatusUpdateDTO statusUpdateDTO) {
        BookingResponseDTO response = bookingService.updateBookingStatus(id, statusUpdateDTO);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/api/bookings/{id}/cancel")
    @PreAuthorize("hasAnyRole('CONSUMER', 'PROVIDER', 'ADMIN')")
    public ResponseEntity<BookingResponseDTO> cancelBooking(@PathVariable("id") Long id) {
        BookingResponseDTO response = bookingService.cancelBooking(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/api/bookings/{id}/confirm-payment")
    public ResponseEntity<Void> confirmBookingPayment(@PathVariable("id") Long id) {
        bookingService.confirmBookingPayment(id);
        return ResponseEntity.ok().build();
    }
}
