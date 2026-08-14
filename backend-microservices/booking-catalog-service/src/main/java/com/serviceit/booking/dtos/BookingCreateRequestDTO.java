package com.serviceit.booking.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class BookingCreateRequestDTO {

    @NotNull(message = "Provider Service ID is required")
    private Long providerServiceId;

    @NotNull(message = "Service date is required")
    @FutureOrPresent(message = "Service date cannot be in the past")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate serviceDate;

    @NotNull(message = "Service time is required")
    @JsonFormat(pattern = "HH:mm[:ss]")
    private LocalTime serviceTime;

    @NotBlank(message = "Service address is required")
    @Size(max = 255, message = "Service address cannot exceed 255 characters")
    private String serviceAddress;

    @Size(max = 500, message = "Special instructions cannot exceed 500 characters")
    private String specialInstructions;

    public BookingCreateRequestDTO() {}

    public BookingCreateRequestDTO(Long providerServiceId, LocalDate serviceDate, LocalTime serviceTime, String serviceAddress, String specialInstructions) {
        this.providerServiceId = providerServiceId;
        this.serviceDate = serviceDate;
        this.serviceTime = serviceTime;
        this.serviceAddress = serviceAddress;
        this.specialInstructions = specialInstructions;
    }

    public Long getProviderServiceId() { return providerServiceId; }
    public void setProviderServiceId(Long providerServiceId) { this.providerServiceId = providerServiceId; }
    public LocalDate getServiceDate() { return serviceDate; }
    public void setServiceDate(LocalDate serviceDate) { this.serviceDate = serviceDate; }
    public LocalTime getServiceTime() { return serviceTime; }
    public void setServiceTime(LocalTime serviceTime) { this.serviceTime = serviceTime; }
    public String getServiceAddress() { return serviceAddress; }
    public void setServiceAddress(String serviceAddress) { this.serviceAddress = serviceAddress; }
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
}
