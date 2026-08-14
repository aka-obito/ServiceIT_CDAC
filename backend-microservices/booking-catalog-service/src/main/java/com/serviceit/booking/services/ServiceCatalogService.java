package com.serviceit.booking.services;

import java.util.List;
import com.serviceit.booking.dtos.ServiceCatalogRequestDTO;
import com.serviceit.booking.dtos.ServiceCatalogResponseDTO;

public interface ServiceCatalogService {

    ServiceCatalogResponseDTO createService(ServiceCatalogRequestDTO serviceRequest);

    ServiceCatalogResponseDTO getServiceById(Long serviceId);

    List<ServiceCatalogResponseDTO> getAllActiveServices();

    List<ServiceCatalogResponseDTO> getAllServices();

    ServiceCatalogResponseDTO updateService(Long serviceId, ServiceCatalogRequestDTO serviceRequest);

    void toggleServiceStatus(Long serviceId);
}
