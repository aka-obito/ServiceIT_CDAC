package com.serviceit.booking.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.serviceit.booking.feign.dto.EmailNotificationRequestDTO;

@FeignClient(name = "payment-notification-service")
public interface NotificationServiceClient {

    @PostMapping("/api/notifications/send-email")
    void sendEmail(@RequestBody EmailNotificationRequestDTO request);

}
