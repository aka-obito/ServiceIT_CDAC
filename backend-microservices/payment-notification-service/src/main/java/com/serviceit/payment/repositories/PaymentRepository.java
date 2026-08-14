package com.serviceit.payment.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.serviceit.payment.entities.Payment;
import com.serviceit.payment.entities.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);
}
