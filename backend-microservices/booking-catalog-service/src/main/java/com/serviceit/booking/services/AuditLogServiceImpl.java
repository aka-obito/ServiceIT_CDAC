package com.serviceit.booking.services;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.serviceit.booking.dtos.AuditLogDTO;
import com.serviceit.booking.entities.AuditLog;
import com.serviceit.booking.repositories.AuditLogRepository;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogServiceImpl.class);

    private final AuditLogRepository auditLogRepository;

    public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(String action, String performedBy, String userRole, String entityName, Long entityId, String details) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .action(action)
                    .performedBy(performedBy != null ? performedBy : "SYSTEM")
                    .userRole(userRole)
                    .entityName(entityName)
                    .entityId(entityId)
                    .details(details)
                    .build();
            auditLogRepository.save(auditLog);
            log.info("[AUDIT] Action: {} | PerformedBy: {} ({}) | Entity: {}#{} | Details: {}",
                    action, performedBy, userRole, entityName, entityId, details);
        } catch (Exception e) {
            log.error("[AUDIT-ERROR] Failed to save audit log: {}", e.getMessage());
        }
    }

    @Override
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(String action, String performedBy, String entityName, Long entityId, String details) {
        log(action, performedBy, null, entityName, entityId, details);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getLogsByEntity(String entityName) {
        return auditLogRepository.findByEntityNameOrderByTimestampDesc(entityName).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getLogsByUser(String performedBy) {
        return auditLogRepository.findByPerformedByOrderByTimestampDesc(performedBy).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AuditLogDTO mapToDTO(AuditLog log) {
        return AuditLogDTO.builder()
                .id(log.getId())
                .action(log.getAction())
                .performedBy(log.getPerformedBy())
                .userEmail(log.getPerformedBy())
                .userRole(log.getUserRole())
                .entityName(log.getEntityName())
                .entityId(log.getEntityId())
                .details(log.getDetails())
                .timestamp(log.getTimestamp())
                .build();
    }
}
