package com.serviceit.auth.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.serviceit.auth.dtos.AdminProviderStatusUpdateDTO;
import com.serviceit.auth.dtos.ServiceProviderProfileResponseDTO;
import com.serviceit.auth.dtos.UserResponseDTO;
import com.serviceit.auth.services.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminService adminService;

    public AdminUserController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable("id") Long id) {
        adminService.toggleUserStatus(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/providers/pending")
    public ResponseEntity<List<ServiceProviderProfileResponseDTO>> getPendingProviders() {
        return ResponseEntity.ok(adminService.getPendingProviders());
    }

    @PatchMapping("/providers/{providerId}/status")
    public ResponseEntity<ServiceProviderProfileResponseDTO> updateProviderStatus(
            @PathVariable("providerId") Long providerId,
            @Valid @RequestBody AdminProviderStatusUpdateDTO statusUpdateDTO) {
        return ResponseEntity.ok(adminService.updateProviderStatus(providerId, statusUpdateDTO));
    }
}
