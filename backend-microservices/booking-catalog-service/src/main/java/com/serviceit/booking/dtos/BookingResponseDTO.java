package com.serviceit.booking.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.serviceit.booking.entities.BookingStatus;

public class BookingResponseDTO {

    private Long bookingId;
    private Long consumerId;
    private Long consumerUserId;
    private String consumerName;
    private String consumerEmail;
    private Long providerId;
    private Long providerUserId;
    private String providerName;
    private String providerEmail;
    private Long serviceId;
    private String serviceName;
    private Integer estimatedDuration;
    private LocalDate serviceDate;
    private LocalTime serviceTime;
    private BookingStatus bookingStatus;
    private BigDecimal totalAmount;
    private String serviceAddress;
    private String specialInstructions;
    private LocalDateTime createdOn;

    public BookingResponseDTO() {}

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public Long getConsumerId() { return consumerId; }
    public void setConsumerId(Long consumerId) { this.consumerId = consumerId; }
    public Long getConsumerUserId() { return consumerUserId; }
    public void setConsumerUserId(Long consumerUserId) { this.consumerUserId = consumerUserId; }
    public String getConsumerName() { return consumerName; }
    public void setConsumerName(String consumerName) { this.consumerName = consumerName; }
    public String getConsumerEmail() { return consumerEmail; }
    public void setConsumerEmail(String consumerEmail) { this.consumerEmail = consumerEmail; }
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
    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }
    public LocalDate getServiceDate() { return serviceDate; }
    public void setServiceDate(LocalDate serviceDate) { this.serviceDate = serviceDate; }
    public LocalTime getServiceTime() { return serviceTime; }
    public void setServiceTime(LocalTime serviceTime) { this.serviceTime = serviceTime; }
    public BookingStatus getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getServiceAddress() { return serviceAddress; }
    public void setServiceAddress(String serviceAddress) { this.serviceAddress = serviceAddress; }
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
    public LocalDateTime getCreatedOn() { return createdOn; }
    public void setCreatedOn(LocalDateTime createdOn) { this.createdOn = createdOn; }
}
