package com.serviceit.payment.dtos;

import jakarta.validation.constraints.NotNull;

public class PaymentOrderRequestDTO {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    public PaymentOrderRequestDTO() {}

    public PaymentOrderRequestDTO(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
}
