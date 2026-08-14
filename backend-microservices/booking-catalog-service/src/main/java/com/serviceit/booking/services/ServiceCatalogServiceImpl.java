package com.serviceit.booking.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.serviceit.booking.dtos.ServiceCatalogRequestDTO;
import com.serviceit.booking.dtos.ServiceCatalogResponseDTO;
import com.serviceit.booking.entities.ServiceCatalog;
import com.serviceit.booking.exceptions.DuplicateResourceException;
import com.serviceit.booking.exceptions.ResourceNotFoundException;
import com.serviceit.booking.repositories.ServiceCatalogRepository;
import com.serviceit.booking.security.SecurityUtils;

@Service
@Transactional
public class ServiceCatalogServiceImpl implements ServiceCatalogService {

    private final ServiceCatalogRepository serviceCatalogRepository;
    private final AuditLogService auditLogService;
    private final SecurityUtils securityUtils;
    private final ModelMapper modelMapper;

    public ServiceCatalogServiceImpl(ServiceCatalogRepository serviceCatalogRepository,
                                     AuditLogService auditLogService,
                                     SecurityUtils securityUtils,
                                     ModelMapper modelMapper) {
        this.serviceCatalogRepository = serviceCatalogRepository;
        this.auditLogService = auditLogService;
        this.securityUtils = securityUtils;
        this.modelMapper = modelMapper;
    }

    @Override
    public ServiceCatalogResponseDTO createService(ServiceCatalogRequestDTO serviceRequest) {
        if (serviceCatalogRepository.existsByServiceNameIgnoreCase(serviceRequest.getServiceName())) {
            throw new DuplicateResourceException("Service already exists: " + serviceRequest.getServiceName());
        }

        ServiceCatalog service = new ServiceCatalog(
                serviceRequest.getServiceName(),
                serviceRequest.getDescription()
        );

        ServiceCatalog saved = serviceCatalogRepository.save(service);
        auditLogService.log("SERVICE_CREATED", securityUtils.getCurrentUserEmail(), "ADMIN",
                "ServiceCatalog", saved.getId(), "Created service: " + saved.getServiceName());

        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceCatalogResponseDTO getServiceById(Long serviceId) {
        ServiceCatalog service = serviceCatalogRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceId));
        return mapToDTO(service);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceCatalogResponseDTO> getAllActiveServices() {
        return serviceCatalogRepository.findByActiveTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceCatalogResponseDTO> getAllServices() {
        return serviceCatalogRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceCatalogResponseDTO updateService(Long serviceId, ServiceCatalogRequestDTO serviceRequest) {
        ServiceCatalog service = serviceCatalogRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceId));

        if (!service.getServiceName().equalsIgnoreCase(serviceRequest.getServiceName()) &&
                serviceCatalogRepository.existsByServiceNameIgnoreCase(serviceRequest.getServiceName())) {
            throw new DuplicateResourceException("Service name already in use: " + serviceRequest.getServiceName());
        }

        service.setServiceName(serviceRequest.getServiceName());
        service.setDescription(serviceRequest.getDescription());

        ServiceCatalog updated = serviceCatalogRepository.save(service);
        auditLogService.log("SERVICE_UPDATED", securityUtils.getCurrentUserEmail(), "ADMIN",
                "ServiceCatalog", updated.getId(), "Updated service: " + updated.getServiceName());

        return mapToDTO(updated);
    }

    @Override
    public void toggleServiceStatus(Long serviceId) {
        ServiceCatalog service = serviceCatalogRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceId));

        service.setActive(!service.isActive());
        serviceCatalogRepository.save(service);

        auditLogService.log("SERVICE_STATUS_TOGGLED", securityUtils.getCurrentUserEmail(), "ADMIN",
                "ServiceCatalog", service.getId(), "Service active: " + service.isActive());
    }

    private ServiceCatalogResponseDTO mapToDTO(ServiceCatalog service) {
        ServiceCatalogResponseDTO dto = modelMapper.map(service, ServiceCatalogResponseDTO.class);
        dto.setServiceId(service.getId());
        return dto;
    }
}
