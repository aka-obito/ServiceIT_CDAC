package com.serviceit.auth.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "booking-catalog-service")
public interface AuditLogServiceClient {

    @PostMapping("/api/admin/logs")
    void recordAuditLog(@RequestBody AuditLogRequestDTO request);

    class AuditLogRequestDTO {
        private String action;
        private String performedBy;
        private String userEmail;
        private String userRole;
        private String entityName;
        private Long entityId;
        private String details;

        public AuditLogRequestDTO() {}

        public AuditLogRequestDTO(String action, String performedBy, String userRole, String entityName, Long entityId, String details) {
            this.action = action;
            this.performedBy = performedBy;
            this.userEmail = performedBy;
            this.userRole = userRole;
            this.entityName = entityName;
            this.entityId = entityId;
            this.details = details;
        }

        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public String getPerformedBy() { return performedBy; }
        public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }
        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
        public String getUserRole() { return userRole; }
        public void setUserRole(String userRole) { this.userRole = userRole; }
        public String getEntityName() { return entityName; }
        public void setEntityName(String entityName) { this.entityName = entityName; }
        public Long getEntityId() { return entityId; }
        public void setEntityId(Long entityId) { this.entityId = entityId; }
        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
    }
}
