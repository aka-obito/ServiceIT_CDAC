package com.serviceit.auth.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.serviceit.auth.dtos.ServiceProviderProfileRequestDTO;
import com.serviceit.auth.dtos.ServiceProviderProfileResponseDTO;
import com.serviceit.auth.services.ServiceProviderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/providers")
public class ServiceProviderController {

    private final ServiceProviderService serviceProviderService;

    public ServiceProviderController(ServiceProviderService serviceProviderService) {
        this.serviceProviderService = serviceProviderService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceProviderProfileResponseDTO> getCurrentProviderProfile() {
        return ResponseEntity.ok(serviceProviderService.getCurrentProviderProfile());
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ServiceProviderProfileResponseDTO> updateProviderProfile(
            @Valid @RequestBody ServiceProviderProfileRequestDTO profileRequest) {
        return ResponseEntity.ok(serviceProviderService.updateProviderProfile(profileRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceProviderProfileResponseDTO> getProviderById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(serviceProviderService.getProviderById(id));
    }
}
