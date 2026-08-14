package com.serviceit.payment.dtos;

import java.math.BigDecimal;

public class PaymentOrderResponseDTO {

    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String razorpayKeyId;
    private Long bookingId;

    public PaymentOrderResponseDTO() {}

    public PaymentOrderResponseDTO(String razorpayOrderId, BigDecimal amount, String currency, String razorpayKeyId, Long bookingId) {
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.currency = currency;
        this.razorpayKeyId = razorpayKeyId;
        this.bookingId = bookingId;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String razorpayOrderId;
        private BigDecimal amount;
        private String currency;
        private String razorpayKeyId;
        private Long bookingId;

        public Builder razorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder currency(String currency) { this.currency = currency; return this; }
        public Builder razorpayKeyId(String razorpayKeyId) { this.razorpayKeyId = razorpayKeyId; return this; }
        public Builder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }

        public PaymentOrderResponseDTO build() {
            return new PaymentOrderResponseDTO(razorpayOrderId, amount, currency, razorpayKeyId, bookingId);
        }
    }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getRazorpayKeyId() { return razorpayKeyId; }
    public void setRazorpayKeyId(String razorpayKeyId) { this.razorpayKeyId = razorpayKeyId; }
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
}
