package com.serviceit.booking.feign.dto;

public class EmailNotificationRequestDTO {
    private String type; // VERIFICATION, WELCOME, PASSWORD_RESET, PROVIDER_APPROVAL, BOOKING_CONFIRMATION, PROVIDER_ALERT, SERVICE_COMPLETED, BOOKING_CANCELLED_CONSUMER, BOOKING_CANCELLED_PROVIDER
    private String to;
    private String fullName;
    private String role;
    private String businessName;
    private String serviceName;
    private String serviceDate;
    private String serviceTime;
    private String link;
    private String consumerName;
    private String serviceAddress;

    public EmailNotificationRequestDTO() {}

    public EmailNotificationRequestDTO(String type, String to, String fullName, String role, String businessName,
                                       String serviceName, String serviceDate, String serviceTime, String link,
                                       String consumerName, String serviceAddress) {
        this.type = type;
        this.to = to;
        this.fullName = fullName;
        this.role = role;
        this.businessName = businessName;
        this.serviceName = serviceName;
        this.serviceDate = serviceDate;
        this.serviceTime = serviceTime;
        this.link = link;
        this.consumerName = consumerName;
        this.serviceAddress = serviceAddress;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String type;
        private String to;
        private String fullName;
        private String role;
        private String businessName;
        private String serviceName;
        private String serviceDate;
        private String serviceTime;
        private String link;
        private String consumerName;
        private String serviceAddress;

        public Builder type(String type) { this.type = type; return this; }
        public Builder to(String to) { this.to = to; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder businessName(String businessName) { this.businessName = businessName; return this; }
        public Builder serviceName(String serviceName) { this.serviceName = serviceName; return this; }
        public Builder serviceDate(String serviceDate) { this.serviceDate = serviceDate; return this; }
        public Builder serviceTime(String serviceTime) { this.serviceTime = serviceTime; return this; }
        public Builder link(String link) { this.link = link; return this; }
        public Builder consumerName(String consumerName) { this.consumerName = consumerName; return this; }
        public Builder serviceAddress(String serviceAddress) { this.serviceAddress = serviceAddress; return this; }

        public EmailNotificationRequestDTO build() {
            return new EmailNotificationRequestDTO(type, to, fullName, role, businessName, serviceName, serviceDate, serviceTime, link, consumerName, serviceAddress);
        }
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getServiceDate() { return serviceDate; }
    public void setServiceDate(String serviceDate) { this.serviceDate = serviceDate; }
    public String getServiceTime() { return serviceTime; }
    public void setServiceTime(String serviceTime) { this.serviceTime = serviceTime; }
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
    public String getConsumerName() { return consumerName; }
    public void setConsumerName(String consumerName) { this.consumerName = consumerName; }
    public String getServiceAddress() { return serviceAddress; }
    public void setServiceAddress(String serviceAddress) { this.serviceAddress = serviceAddress; }
}
