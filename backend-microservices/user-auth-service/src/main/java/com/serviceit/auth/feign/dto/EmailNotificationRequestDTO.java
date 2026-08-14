package com.serviceit.auth.feign.dto;

public class EmailNotificationRequestDTO {
    private String type; // VERIFICATION, WELCOME, PASSWORD_RESET, PROVIDER_APPROVAL, BOOKING_CONFIRMATION, PROVIDER_ALERT, SERVICE_COMPLETED
    private String to;
    private String fullName;
    private String role;
    private String businessName;
    private String link;

    public EmailNotificationRequestDTO() {}

    public EmailNotificationRequestDTO(String type, String to, String fullName, String role, String businessName, String link) {
        this.type = type;
        this.to = to;
        this.fullName = fullName;
        this.role = role;
        this.businessName = businessName;
        this.link = link;
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
        private String link;

        public Builder type(String type) { this.type = type; return this; }
        public Builder to(String to) { this.to = to; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder businessName(String businessName) { this.businessName = businessName; return this; }
        public Builder link(String link) { this.link = link; return this; }

        public EmailNotificationRequestDTO build() {
            return new EmailNotificationRequestDTO(type, to, fullName, role, businessName, link);
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
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
}
