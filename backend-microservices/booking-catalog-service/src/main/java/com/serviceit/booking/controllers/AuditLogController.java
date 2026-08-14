package com.serviceit.booking.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.serviceit.booking.dtos.AuditLogDTO;
import com.serviceit.booking.services.AuditLogService;

@RestController
@RequestMapping("/api/admin/logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<List<AuditLogDTO>> getAllLogs(
            @RequestParam(value = "entity", required = false) String entity,
            @RequestParam(value = "user", required = false) String user) {

        if (entity != null && !entity.isBlank()) {
            return ResponseEntity.ok(auditLogService.getLogsByEntity(entity));
        }
        if (user != null && !user.isBlank()) {
            return ResponseEntity.ok(auditLogService.getLogsByUser(user));
        }
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    @PostMapping
    public ResponseEntity<Void> recordAuditLog(@RequestBody AuditLogDTO logDTO) {
        auditLogService.log(
                logDTO.getAction(),
                logDTO.getUserEmail() != null ? logDTO.getUserEmail() : logDTO.getPerformedBy(),
                logDTO.getUserRole(),
                logDTO.getEntityName(),
                logDTO.getEntityId(),
                logDTO.getDetails()
        );
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
