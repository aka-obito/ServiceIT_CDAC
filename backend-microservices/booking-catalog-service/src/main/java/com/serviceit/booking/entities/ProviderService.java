package com.serviceit.booking.entities;

import java.math.BigDecimal;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(
        name = "provider_services",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_provider_service",
                columnNames = {"provider_id", "service_id"}
        )
)
@AttributeOverride(name = "id", column = @Column(name = "provider_service_id"))
public class ProviderService extends BaseEntity {

    @NotNull(message = "Provider ID is required")
    @Column(name = "provider_id", nullable = false)
    private Long providerId;

    @NotNull(message = "Provider User ID is required")
    @Column(name = "provider_user_id", nullable = false)
    private Long providerUserId;

    @Column(name = "provider_name", length = 100)
    private String providerName;

    @Column(name = "provider_email", length = 100)
    private String providerEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceCatalog service;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    @Digits(integer = 8, fraction = 2, message = "Price format: up to 8 digits, 2 decimals")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull(message = "Estimated duration is required")
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    @Max(value = 480, message = "Duration cannot exceed 480 minutes (8 hours)")
    @Column(name = "estimated_duration", nullable = false)
    private Integer estimatedDuration;

    @Column(name = "is_available", nullable = false)
    private boolean available = true;

    public ProviderService() {}

    public ProviderService(Long providerId, Long providerUserId, String providerName,
                           String providerEmail, ServiceCatalog service, BigDecimal price,
                           Integer estimatedDuration) {
        this.providerId = providerId;
        this.providerUserId = providerUserId;
        this.providerName = providerName;
        this.providerEmail = providerEmail;
        this.service = service;
        this.price = price;
        this.estimatedDuration = estimatedDuration;
        this.available = true;
    }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
    public Long getProviderUserId() { return providerUserId; }
    public void setProviderUserId(Long providerUserId) { this.providerUserId = providerUserId; }
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public String getProviderEmail() { return providerEmail; }
    public void setProviderEmail(String providerEmail) { this.providerEmail = providerEmail; }
    public ServiceCatalog getService() { return service; }
    public void setService(ServiceCatalog service) { this.service = service; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
