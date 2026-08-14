package com.serviceit.booking.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.serviceit.booking.entities.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findByEntityNameOrderByTimestampDesc(String entityName);

    List<AuditLog> findByPerformedByOrderByTimestampDesc(String performedBy);
}
