package com.serviceit.booking.dtos;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ProviderServiceRequestDTO {

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    @Digits(integer = 8, fraction = 2, message = "Price format: up to 8 digits, 2 decimals")
    private BigDecimal price;

    @NotNull(message = "Estimated duration is required")
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    @Max(value = 480, message = "Duration cannot exceed 480 minutes")
    private Integer estimatedDuration;

    private Boolean available = true;

    private String description;

    public ProviderServiceRequestDTO() {}

    public ProviderServiceRequestDTO(Long serviceId, BigDecimal price, Integer estimatedDuration) {
        this.serviceId = serviceId;
        this.price = price;
        this.estimatedDuration = estimatedDuration;
        this.available = true;
    }

    public ProviderServiceRequestDTO(Long serviceId, BigDecimal price, Integer estimatedDuration, Boolean available, String description) {
        this.serviceId = serviceId;
        this.price = price;
        this.estimatedDuration = estimatedDuration;
        this.available = available != null ? available : true;
        this.description = description;
    }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }
    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
