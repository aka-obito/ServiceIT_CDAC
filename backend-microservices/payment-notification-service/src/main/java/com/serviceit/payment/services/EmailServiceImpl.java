package com.serviceit.payment.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.serviceit.payment.dtos.EmailNotificationRequestDTO;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:dhawaleritik3@gmail.com}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    @Async
    public void handleNotification(EmailNotificationRequestDTO req) {
        if (req == null || req.getTo() == null || req.getTo().isBlank()) return;

        switch (req.getType() != null ? req.getType().toUpperCase() : "") {
            case "VERIFICATION":
                sendEmail(req.getTo(), "Verify Your SERVICEiT Account",
                        "Hello " + req.getFullName() + ",\n\n"
                        + "Welcome to SERVICEiT!\n"
                        + "Please click the link below to verify your email address:\n\n"
                        + req.getLink() + "\n\n"
                        + "Thank you,\nSERVICEiT Team");
                break;

            case "WELCOME":
                sendEmail(req.getTo(), "Welcome to SERVICEiT!",
                        "Hello " + req.getFullName() + ",\n\n"
                        + "Your email has been verified successfully!\n"
                        + "You can now log in and access all features on SERVICEiT.\n\n"
                        + "Thank you,\nSERVICEiT Team");
                break;

            case "PASSWORD_RESET":
                sendEmail(req.getTo(), "Reset Your SERVICEiT Password",
                        "Hello " + req.getFullName() + ",\n\n"
                        + "We received a request to reset your password.\n"
                        + "Click the link below to set a new password (valid for 1 hour):\n\n"
                        + req.getLink() + "\n\n"
                        + "If you did not request this, please ignore this email.\n\n"
                        + "Thank you,\nSERVICEiT Team");
                break;

            case "PROVIDER_APPROVAL":
                sendEmail(req.getTo(), "Congratulations! Your SERVICEiT Provider Account is Approved",
                        "Hello " + req.getFullName() + ",\n\n"
                        + "Great news! Your service provider profile for \"" + req.getBusinessName() + "\" has been approved by the Admin.\n\n"
                        + "You can now log in, add your services, and start accepting bookings from consumers!\n\n"
                        + "Best regards,\nSERVICEiT Admin Team");
                break;

            case "BOOKING_CONFIRMATION":
                sendEmail(req.getTo(), "Booking Confirmed - SERVICEiT",
                        "Hello " + req.getFullName() + ",\n\n"
                        + "Your booking for " + req.getServiceName() + " has been successfully confirmed!\n"
                        + "Date: " + req.getServiceDate() + "\n"
                        + "Time: " + req.getServiceTime() + "\n\n"
                        + "Please be available at your registered service address at the scheduled time.\n\n"
                        + "Thank you for choosing SERVICEiT!");
                break;

            case "PROVIDER_ALERT":
                sendEmail(req.getTo(), "New Booking Alert - SERVICEiT",
                        "Hello " + req.getFullName() + ",\n\n"
                        + "You have been booked for a service on SERVICEiT!\n\n"
                        + "📋 Booking Details:\n"
                        + "• Service: " + req.getServiceName() + "\n"
                        + "• Customer Name: " + (req.getConsumerName() != null ? req.getConsumerName() : "Customer") + "\n"
                        + "• Scheduled Date: " + req.getServiceDate() + "\n"
                        + "• Scheduled Time: " + req.getServiceTime() + "\n"
                        + "• Service Location: " + (req.getServiceAddress() != null ? req.getServiceAddress() : "As specified in booking") + "\n\n"
                        + "Please make sure to be available on time and provide a great service experience.\n\n"
                        + "Best regards,\nSERVICEiT Team");
                break;

            case "SERVICE_COMPLETED":
                sendEmail(req.getTo(), "Service Completed - Thank You from SERVICEiT",
                        "Hello " + req.getFullName() + ",\n\n"
                        + "We are happy to let you know that your service \"" + req.getServiceName() + "\" has been marked as completed.\n\n"
                        + "We hope you had a great experience!\n\n"
                        + "Warm regards,\nSERVICEiT Team");
                break;

            case "BOOKING_CANCELLED_CONSUMER":
                sendEmail(req.getTo(), "Booking Cancelled - SERVICEiT",
                        "Hello " + req.getFullName() + ",\n\n"
                        + "Your booking for " + req.getServiceName() + " has been successfully cancelled.\n\n"
                        + "📋 Booking Details:\n"
                        + "• Service: " + req.getServiceName() + "\n"
                        + "• Scheduled Date: " + req.getServiceDate() + "\n"
                        + "• Scheduled Time: " + req.getServiceTime() + "\n\n"
                        + "Thank you,\nSERVICEiT Team");
                break;

            case "BOOKING_CANCELLED_PROVIDER":
                sendEmail(req.getTo(), "Booking Cancelled Notification - SERVICEiT",
                        "Hello " + req.getFullName() + ",\n\n"
                        + "A customer has cancelled their booking with you on SERVICEiT.\n\n"
                        + "📋 Cancelled Booking Details:\n"
                        + "• Customer Name: " + (req.getConsumerName() != null ? req.getConsumerName() : "Customer") + "\n"
                        + "• Service: " + req.getServiceName() + "\n"
                        + "• Scheduled Date: " + req.getServiceDate() + "\n"
                        + "• Scheduled Time: " + req.getServiceTime() + "\n\n"
                        + "Your schedule has been freed up for this time slot.\n\n"
                        + "Best regards,\nSERVICEiT Team");
                break;

            default:
                log.warn("Unknown notification type: {}", req.getType());
        }
    }

    @Override
    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("[MAIL-SENT] Successfully dispatched email to: {} | Subject: {}", to, subject);
        } catch (Exception e) {
            log.error("[MAIL-ERROR] Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
