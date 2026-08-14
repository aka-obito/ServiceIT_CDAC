package com.serviceit.auth.services;

import com.serviceit.auth.dtos.ServiceProviderProfileRequestDTO;
import com.serviceit.auth.dtos.ServiceProviderProfileResponseDTO;

public interface ServiceProviderService {

    ServiceProviderProfileResponseDTO getCurrentProviderProfile();

    ServiceProviderProfileResponseDTO updateProviderProfile(ServiceProviderProfileRequestDTO profileRequest);

    ServiceProviderProfileResponseDTO getProviderById(Long providerId);
}
