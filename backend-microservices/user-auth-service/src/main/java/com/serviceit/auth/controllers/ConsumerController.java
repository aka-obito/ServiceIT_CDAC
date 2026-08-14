package com.serviceit.auth.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.serviceit.auth.dtos.ConsumerProfileRequestDTO;
import com.serviceit.auth.dtos.ConsumerProfileResponseDTO;
import com.serviceit.auth.services.ConsumerService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/consumers")
public class ConsumerController {

    private final ConsumerService consumerService;

    public ConsumerController(ConsumerService consumerService) {
        this.consumerService = consumerService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<ConsumerProfileResponseDTO> getCurrentConsumerProfile() {
        return ResponseEntity.ok(consumerService.getCurrentConsumerProfile());
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<ConsumerProfileResponseDTO> updateConsumerProfile(
            @Valid @RequestBody ConsumerProfileRequestDTO profileRequest) {
        return ResponseEntity.ok(consumerService.updateConsumerProfile(profileRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsumerProfileResponseDTO> getConsumerById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(consumerService.getConsumerById(id));
    }
}
