package com.serviceit.booking.dtos;

import java.math.BigDecimal;

public class ProviderServiceResponseDTO {

    private Long providerServiceId;
    private Long providerId;
    private Long providerUserId;
    private String providerName;
    private String providerEmail;
    private Long serviceId;
    private String serviceName;
    private String description;
    private BigDecimal price;
    private Integer estimatedDuration;
    private boolean available;

    public ProviderServiceResponseDTO() {}

    public Long getProviderServiceId() { return providerServiceId; }
    public void setProviderServiceId(Long providerServiceId) { this.providerServiceId = providerServiceId; }
    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
    public Long getProviderUserId() { return providerUserId; }
    public void setProviderUserId(Long providerUserId) { this.providerUserId = providerUserId; }
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public String getProviderEmail() { return providerEmail; }
    public void setProviderEmail(String providerEmail) { this.providerEmail = providerEmail; }
    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
