package com.serviceit.booking.services;

import java.util.List;
import com.serviceit.booking.dtos.ProviderServiceRequestDTO;
import com.serviceit.booking.dtos.ProviderServiceResponseDTO;

public interface ProviderServiceService {

    ProviderServiceResponseDTO addServiceToProvider(ProviderServiceRequestDTO request);

    ProviderServiceResponseDTO getProviderServiceById(Long providerServiceId);

    List<ProviderServiceResponseDTO> getMyServices();

    List<ProviderServiceResponseDTO> getServicesByProviderId(Long providerId);

    List<ProviderServiceResponseDTO> getProvidersByServiceId(Long serviceId);

    List<ProviderServiceResponseDTO> getAllAvailableServices();

    List<ProviderServiceResponseDTO> searchAvailableServices(String serviceQuery, String sort);

    ProviderServiceResponseDTO updateProviderService(Long providerServiceId, ProviderServiceRequestDTO request);

    void toggleServiceAvailability(Long providerServiceId);

    void removeServiceFromProvider(Long providerServiceId);
}
