package com.serviceit.booking.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.serviceit.booking.entities.ServiceCatalog;

public interface ServiceCatalogRepository extends JpaRepository<ServiceCatalog, Long> {

    List<ServiceCatalog> findByActiveTrue();

    boolean existsByServiceNameIgnoreCase(String serviceName);

    Optional<ServiceCatalog> findByServiceNameIgnoreCase(String serviceName);
}
