package com.serviceit.booking.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.serviceit.booking.dtos.ProviderServiceRequestDTO;
import com.serviceit.booking.dtos.ProviderServiceResponseDTO;
import com.serviceit.booking.services.ProviderServiceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/provider-services")
public class ProviderServiceController {

    private final ProviderServiceService providerServiceService;

    public ProviderServiceController(ProviderServiceService providerServiceService) {
        this.providerServiceService = providerServiceService;
    }

    @PostMapping
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProviderServiceResponseDTO> addServiceToProvider(
            @Valid @RequestBody ProviderServiceRequestDTO request) {
        ProviderServiceResponseDTO response = providerServiceService.addServiceToProvider(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderServiceResponseDTO> getProviderServiceById(@PathVariable("id") Long id) {
        ProviderServiceResponseDTO response = providerServiceService.getProviderServiceById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-services")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<List<ProviderServiceResponseDTO>> getMyServices() {
        List<ProviderServiceResponseDTO> response = providerServiceService.getMyServices();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ProviderServiceResponseDTO>> getServicesByProviderId(@PathVariable("providerId") Long providerId) {
        List<ProviderServiceResponseDTO> response = providerServiceService.getServicesByProviderId(providerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<ProviderServiceResponseDTO>> getProvidersByServiceId(@PathVariable("serviceId") Long serviceId) {
        List<ProviderServiceResponseDTO> response = providerServiceService.getProvidersByServiceId(serviceId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/available")
    public ResponseEntity<List<ProviderServiceResponseDTO>> searchAvailableServices(
            @org.springframework.web.bind.annotation.RequestParam(name = "service", required = false) String service,
            @org.springframework.web.bind.annotation.RequestParam(name = "sort", required = false) String sort) {
        List<ProviderServiceResponseDTO> response = providerServiceService.searchAvailableServices(service, sort);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProviderServiceResponseDTO> updateProviderService(
            @PathVariable("id") Long id,
            @Valid @RequestBody ProviderServiceRequestDTO request) {
        ProviderServiceResponseDTO response = providerServiceService.updateProviderService(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Void> toggleServiceAvailability(@PathVariable("id") Long id) {
        providerServiceService.toggleServiceAvailability(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Void> removeServiceFromProvider(@PathVariable("id") Long id) {
        providerServiceService.removeServiceFromProvider(id);
        return ResponseEntity.noContent().build();
    }
}
