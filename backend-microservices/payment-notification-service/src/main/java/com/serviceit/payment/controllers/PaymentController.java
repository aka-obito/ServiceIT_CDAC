package com.serviceit.payment.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.serviceit.payment.dtos.PaymentOrderRequestDTO;
import com.serviceit.payment.dtos.PaymentOrderResponseDTO;
import com.serviceit.payment.dtos.PaymentResponseDTO;
import com.serviceit.payment.dtos.PaymentVerifyRequestDTO;
import com.serviceit.payment.services.RazorpayPaymentService;

import jakarta.validation.Valid;

@RestController
public class PaymentController {

    private final RazorpayPaymentService paymentService;

    public PaymentController(RazorpayPaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/api/payments/create-order")
    public ResponseEntity<PaymentOrderResponseDTO> createOrder(@Valid @RequestBody PaymentOrderRequestDTO request) {
        PaymentOrderResponseDTO response = paymentService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/api/payments/verify")
    public ResponseEntity<PaymentResponseDTO> verifyPayment(@Valid @RequestBody PaymentVerifyRequestDTO request) {
        PaymentResponseDTO response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/payments/booking/{bookingId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentByBookingId(@PathVariable("bookingId") Long bookingId) {
        PaymentResponseDTO response = paymentService.getPaymentByBookingId(bookingId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/admin/payments")
    public ResponseEntity<List<PaymentResponseDTO>> getAllPayments() {
        List<PaymentResponseDTO> response = paymentService.getAllPayments();
        return ResponseEntity.ok(response);
    }
}
