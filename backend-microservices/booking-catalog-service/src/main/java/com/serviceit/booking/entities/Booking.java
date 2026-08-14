package com.serviceit.booking.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "bookings")
@AttributeOverride(name = "id", column = @Column(name = "booking_id"))
public class Booking extends BaseEntity {

    @NotNull(message = "Consumer ID is required")
    @Column(name = "consumer_id", nullable = false)
    private Long consumerId;

    @NotNull(message = "Consumer User ID is required")
    @Column(name = "consumer_user_id", nullable = false)
    private Long consumerUserId;

    @Column(name = "consumer_name", length = 100)
    private String consumerName;

    @Column(name = "consumer_email", length = 100)
    private String consumerEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_service_id", nullable = false)
    private ProviderService providerService;

    @NotNull(message = "Service date is required")
    @FutureOrPresent(message = "Service date cannot be in the past")
    @Column(name = "service_date", nullable = false)
    private LocalDate serviceDate;

    @NotNull(message = "Service time is required")
    @Column(name = "service_time", nullable = false)
    private LocalTime serviceTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false)
    private BookingStatus bookingStatus = BookingStatus.PENDING_PAYMENT;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    @Digits(integer = 8, fraction = 2, message = "Amount format: up to 8 digits, 2 decimals")
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @NotBlank(message = "Service address is required")
    @Size(max = 255)
    @Column(name = "service_address", nullable = false, length = 255)
    private String serviceAddress;

    @Size(max = 500)
    @Column(name = "special_instructions", length = 500)
    private String specialInstructions;

    public Booking() {}

    public Booking(Long consumerId, Long consumerUserId, String consumerName, String consumerEmail,
                   ProviderService providerService, LocalDate serviceDate, LocalTime serviceTime,
                   BigDecimal totalAmount, String serviceAddress, String specialInstructions) {
        this.consumerId = consumerId;
        this.consumerUserId = consumerUserId;
        this.consumerName = consumerName;
        this.consumerEmail = consumerEmail;
        this.providerService = providerService;
        this.serviceDate = serviceDate;
        this.serviceTime = serviceTime;
        this.totalAmount = totalAmount;
        this.serviceAddress = serviceAddress;
        this.specialInstructions = specialInstructions;
        this.bookingStatus = BookingStatus.PENDING_PAYMENT;
    }

    public Long getConsumerId() { return consumerId; }
    public void setConsumerId(Long consumerId) { this.consumerId = consumerId; }
    public Long getConsumerUserId() { return consumerUserId; }
    public void setConsumerUserId(Long consumerUserId) { this.consumerUserId = consumerUserId; }
    public String getConsumerName() { return consumerName; }
    public void setConsumerName(String consumerName) { this.consumerName = consumerName; }
    public String getConsumerEmail() { return consumerEmail; }
    public void setConsumerEmail(String consumerEmail) { this.consumerEmail = consumerEmail; }
    public ProviderService getProviderService() { return providerService; }
    public void setProviderService(ProviderService providerService) { this.providerService = providerService; }
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
}
