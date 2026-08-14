package com.serviceit.payment.services;

import com.serviceit.payment.dtos.EmailNotificationRequestDTO;

public interface EmailService {

    void handleNotification(EmailNotificationRequestDTO request);

    void sendEmail(String to, String subject, String body);
}
