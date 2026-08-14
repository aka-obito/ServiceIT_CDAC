package com.serviceit.booking.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "service_catalog")
@AttributeOverride(name = "id", column = @Column(name = "service_id"))
public class ServiceCatalog extends BaseEntity {

    @NotBlank(message = "Service name is required")
    @Size(max = 100)
    @Column(name = "service_name", nullable = false, unique = true, length = 100)
    private String serviceName;

    @Size(max = 500)
    @Column(length = 500)
    private String description;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    public ServiceCatalog() {}

    public ServiceCatalog(String serviceName, String description) {
        this.serviceName = serviceName;
        this.description = description;
        this.active = true;
    }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
