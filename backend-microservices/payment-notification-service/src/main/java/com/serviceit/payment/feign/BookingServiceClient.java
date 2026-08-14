package com.serviceit.payment.feign;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "booking-catalog-service")
public interface BookingServiceClient {

    @GetMapping("/api/bookings/{id}")
    BookingDTO getBookingById(@PathVariable("id") Long id);

    @PutMapping("/api/bookings/{id}/confirm-payment")
    void confirmBookingPayment(@PathVariable("id") Long id);

    class BookingDTO {
        private Long bookingId;
        private Long consumerId;
        private Long consumerUserId;
        private String consumerName;
        private String consumerEmail;
        private Long providerId;
        private Long providerUserId;
        private String providerName;
        private String providerEmail;
        private String serviceName;
        private LocalDate serviceDate;
        private LocalTime serviceTime;
        private BigDecimal totalAmount;
        private String serviceAddress;

        public BookingDTO() {}

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
        public String getServiceName() { return serviceName; }
        public void setServiceName(String serviceName) { this.serviceName = serviceName; }
        public LocalDate getServiceDate() { return serviceDate; }
        public void setServiceDate(LocalDate serviceDate) { this.serviceDate = serviceDate; }
        public LocalTime getServiceTime() { return serviceTime; }
        public void setServiceTime(LocalTime serviceTime) { this.serviceTime = serviceTime; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public String getServiceAddress() { return serviceAddress; }
        public void setServiceAddress(String serviceAddress) { this.serviceAddress = serviceAddress; }
    }
}
