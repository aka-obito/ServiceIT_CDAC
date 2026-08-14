package com.serviceit.booking.services;

import java.util.List;
import com.serviceit.booking.dtos.AuditLogDTO;

public interface AuditLogService {

    void log(String action, String performedBy, String userRole, String entityName, Long entityId, String details);

    void log(String action, String performedBy, String entityName, Long entityId, String details);

    List<AuditLogDTO> getAllLogs();

    List<AuditLogDTO> getLogsByEntity(String entityName);

    List<AuditLogDTO> getLogsByUser(String performedBy);
}
