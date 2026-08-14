package com.serviceit.booking.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.serviceit.booking.entities.ProviderService;

public interface ProviderServiceRepository extends JpaRepository<ProviderService, Long> {

    List<ProviderService> findByProviderId(Long providerId);

    List<ProviderService> findByServiceId(Long serviceId);

    List<ProviderService> findByAvailableTrue();

    List<ProviderService> findByAvailableTrueAndService_ServiceNameContainingIgnoreCase(String serviceName);

    boolean existsByProviderIdAndServiceId(Long providerId, Long serviceId);

    Optional<ProviderService> findByProviderIdAndServiceId(Long providerId, Long serviceId);
}
