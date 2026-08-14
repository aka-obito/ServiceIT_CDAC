package com.serviceit.booking.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.serviceit.booking.dtos.ProviderServiceRequestDTO;
import com.serviceit.booking.dtos.ProviderServiceResponseDTO;
import com.serviceit.booking.entities.ProviderService;
import com.serviceit.booking.entities.ServiceCatalog;
import com.serviceit.booking.exceptions.DuplicateResourceException;
import com.serviceit.booking.exceptions.InvalidOperationException;
import com.serviceit.booking.exceptions.ResourceNotFoundException;
import com.serviceit.booking.repositories.ProviderServiceRepository;
import com.serviceit.booking.repositories.ServiceCatalogRepository;
import com.serviceit.booking.security.SecurityUtils;

@Service
@Transactional
public class ProviderServiceServiceImpl implements ProviderServiceService {

    private final ProviderServiceRepository providerServiceRepository;
    private final ServiceCatalogRepository serviceCatalogRepository;
    private final AuditLogService auditLogService;
    private final SecurityUtils securityUtils;

    public ProviderServiceServiceImpl(ProviderServiceRepository providerServiceRepository,
                                      ServiceCatalogRepository serviceCatalogRepository,
                                      AuditLogService auditLogService,
                                      SecurityUtils securityUtils) {
        this.providerServiceRepository = providerServiceRepository;
        this.serviceCatalogRepository = serviceCatalogRepository;
        this.auditLogService = auditLogService;
        this.securityUtils = securityUtils;
    }

    @Override
    public ProviderServiceResponseDTO addServiceToProvider(ProviderServiceRequestDTO request) {
        Long currentUserId = securityUtils.getCurrentUserId();
        String currentUserName = securityUtils.getCurrentUserFullName();
        Long providerId = currentUserId;

        ServiceCatalog service = serviceCatalogRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + request.getServiceId()));

        if (!service.isActive()) {
            throw new InvalidOperationException("Cannot offer an inactive service.");
        }

        if (providerServiceRepository.existsByProviderIdAndServiceId(providerId, service.getId())) {
            throw new DuplicateResourceException("You are already offering this service: " + service.getServiceName());
        }

        String providerEmail = securityUtils.getCurrentUserEmail();

        ProviderService providerService = new ProviderService(
                providerId,
                currentUserId,
                currentUserName,
                providerEmail,
                service,
                request.getPrice(),
                request.getEstimatedDuration()
        );

        ProviderService saved = providerServiceRepository.save(providerService);
        auditLogService.log("PROVIDER_SERVICE_ADDED", securityUtils.getCurrentUserEmail(), "PROVIDER",
                "ProviderService", saved.getId(), "Added service: " + service.getServiceName() + " at price: " + request.getPrice());

        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ProviderServiceResponseDTO getProviderServiceById(Long providerServiceId) {
        ProviderService ps = providerServiceRepository.findById(providerServiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider service not found with id: " + providerServiceId));
        return mapToDTO(ps);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderServiceResponseDTO> getMyServices() {
        Long currentUserId = securityUtils.getCurrentUserId();
        return providerServiceRepository.findByProviderId(currentUserId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderServiceResponseDTO> getServicesByProviderId(Long providerId) {
        return providerServiceRepository.findByProviderId(providerId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderServiceResponseDTO> getProvidersByServiceId(Long serviceId) {
        return providerServiceRepository.findByServiceId(serviceId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderServiceResponseDTO> getAllAvailableServices() {
        return providerServiceRepository.findByAvailableTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderServiceResponseDTO> searchAvailableServices(String serviceQuery, String sort) {
        List<ProviderService> services;
        if (serviceQuery != null && !serviceQuery.trim().isEmpty()) {
            services = providerServiceRepository.findByAvailableTrueAndService_ServiceNameContainingIgnoreCase(serviceQuery.trim());
        } else {
            services = providerServiceRepository.findByAvailableTrue();
        }

        java.util.stream.Stream<ProviderServiceResponseDTO> stream = services.stream().map(this::mapToDTO);

        if ("price_asc".equalsIgnoreCase(sort)) {
            stream = stream.sorted(java.util.Comparator.comparing(ProviderServiceResponseDTO::getPrice));
        } else if ("price_desc".equalsIgnoreCase(sort)) {
            stream = stream.sorted(java.util.Comparator.comparing(ProviderServiceResponseDTO::getPrice).reversed());
        } else if ("duration_asc".equalsIgnoreCase(sort)) {
            stream = stream.sorted(java.util.Comparator.comparing(ProviderServiceResponseDTO::getEstimatedDuration));
        }

        return stream.collect(Collectors.toList());
    }

    @Override
    public ProviderServiceResponseDTO updateProviderService(Long providerServiceId, ProviderServiceRequestDTO request) {
        Long currentUserId = securityUtils.getCurrentUserId();
        ProviderService ps = providerServiceRepository.findById(providerServiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider service not found with id: " + providerServiceId));

        if (!ps.getProviderId().equals(currentUserId)) {
            throw new InvalidOperationException("You can only update your own services.");
        }

        ps.setPrice(request.getPrice());
        ps.setEstimatedDuration(request.getEstimatedDuration());
        if (request.getAvailable() != null) {
            ps.setAvailable(request.getAvailable());
        }

        ProviderService updated = providerServiceRepository.save(ps);
        auditLogService.log("PROVIDER_SERVICE_UPDATED", securityUtils.getCurrentUserEmail(), "PROVIDER",
                "ProviderService", updated.getId(), "Updated service pricing/duration/availability (" + updated.isAvailable() + "): " + updated.getService().getServiceName());

        return mapToDTO(updated);
    }

    @Override
    public void toggleServiceAvailability(Long providerServiceId) {
        Long currentUserId = securityUtils.getCurrentUserId();
        ProviderService ps = providerServiceRepository.findById(providerServiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider service not found with id: " + providerServiceId));

        if (!ps.getProviderId().equals(currentUserId)) {
            throw new InvalidOperationException("You can only toggle availability of your own services.");
        }

        ps.setAvailable(!ps.isAvailable());
        providerServiceRepository.save(ps);
        auditLogService.log("PROVIDER_SERVICE_TOGGLED", securityUtils.getCurrentUserEmail(), "PROVIDER",
                "ProviderService", ps.getId(), "Service available: " + ps.isAvailable());
    }

    @Override
    public void removeServiceFromProvider(Long providerServiceId) {
        Long currentUserId = securityUtils.getCurrentUserId();
        ProviderService ps = providerServiceRepository.findById(providerServiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider service not found with id: " + providerServiceId));

        if (!ps.getProviderId().equals(currentUserId)) {
            throw new InvalidOperationException("You can only remove your own services.");
        }

        providerServiceRepository.delete(ps);
        auditLogService.log("PROVIDER_SERVICE_REMOVED", securityUtils.getCurrentUserEmail(), "PROVIDER",
                "ProviderService", providerServiceId, "Removed service from provider offerings");
    }

    private ProviderServiceResponseDTO mapToDTO(ProviderService ps) {
        ProviderServiceResponseDTO dto = new ProviderServiceResponseDTO();
        dto.setProviderServiceId(ps.getId());
        dto.setProviderId(ps.getProviderId());
        dto.setProviderUserId(ps.getProviderUserId());
        dto.setProviderName(ps.getProviderName());
        dto.setProviderEmail(ps.getProviderEmail());
        dto.setServiceId(ps.getService().getId());
        dto.setServiceName(ps.getService().getServiceName());
        dto.setDescription(ps.getService().getDescription());
        dto.setPrice(ps.getPrice());
        dto.setEstimatedDuration(ps.getEstimatedDuration());
        dto.setAvailable(ps.isAvailable());
        return dto;
    }
}
