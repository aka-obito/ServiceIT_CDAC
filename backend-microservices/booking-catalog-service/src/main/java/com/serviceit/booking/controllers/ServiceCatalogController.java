package com.serviceit.booking.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.serviceit.booking.dtos.ServiceCatalogRequestDTO;
import com.serviceit.booking.dtos.ServiceCatalogResponseDTO;
import com.serviceit.booking.services.ServiceCatalogService;

import jakarta.validation.Valid;

@RestController
public class ServiceCatalogController {

    private final ServiceCatalogService serviceCatalogService;

    public ServiceCatalogController(ServiceCatalogService serviceCatalogService) {
        this.serviceCatalogService = serviceCatalogService;
    }

    @GetMapping("/api/services")
    public ResponseEntity<List<ServiceCatalogResponseDTO>> getAllActiveServices() {
        List<ServiceCatalogResponseDTO> response = serviceCatalogService.getAllActiveServices();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/services/{id}")
    public ResponseEntity<ServiceCatalogResponseDTO> getServiceById(@PathVariable("id") Long id) {
        ServiceCatalogResponseDTO response = serviceCatalogService.getServiceById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/admin/services")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceCatalogResponseDTO> createService(
            @Valid @RequestBody ServiceCatalogRequestDTO serviceRequest) {
        ServiceCatalogResponseDTO response = serviceCatalogService.createService(serviceRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/admin/services")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ServiceCatalogResponseDTO>> getAllServicesAdmin() {
        List<ServiceCatalogResponseDTO> response = serviceCatalogService.getAllServices();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/api/admin/services/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceCatalogResponseDTO> updateService(
            @PathVariable("id") Long id,
            @Valid @RequestBody ServiceCatalogRequestDTO serviceRequest) {
        ServiceCatalogResponseDTO response = serviceCatalogService.updateService(id, serviceRequest);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/api/admin/services/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleServiceStatus(@PathVariable("id") Long id) {
        serviceCatalogService.toggleServiceStatus(id);
        return ResponseEntity.noContent().build();
    }
}
