package com.serviceit.payment.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.serviceit.payment.dtos.EmailNotificationRequestDTO;
import com.serviceit.payment.services.EmailService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final EmailService emailService;

    public NotificationController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send-email")
    public ResponseEntity<Void> sendEmailNotification(@RequestBody EmailNotificationRequestDTO request) {
        emailService.handleNotification(request);
        return ResponseEntity.ok().build();
    }
}
