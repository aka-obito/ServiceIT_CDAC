package com.serviceit.booking.dtos;

import com.serviceit.booking.entities.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class BookingStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    public BookingStatusUpdateDTO() {}

    public BookingStatusUpdateDTO(BookingStatus status) {
        this.status = status;
    }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
}
