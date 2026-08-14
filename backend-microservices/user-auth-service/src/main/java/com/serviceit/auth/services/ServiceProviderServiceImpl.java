package com.serviceit.auth.services;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.serviceit.auth.dtos.ServiceProviderProfileRequestDTO;
import com.serviceit.auth.dtos.ServiceProviderProfileResponseDTO;
import com.serviceit.auth.entities.ServiceProvider;
import com.serviceit.auth.entities.User;
import com.serviceit.auth.exceptions.ResourceNotFoundException;
import com.serviceit.auth.repositories.ServiceProviderRepository;
import com.serviceit.auth.repositories.UserRepository;
import com.serviceit.auth.security.SecurityUtils;

@Service
@Transactional
public class ServiceProviderServiceImpl implements ServiceProviderService {

    private final ServiceProviderRepository serviceProviderRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final ModelMapper modelMapper;

    public ServiceProviderServiceImpl(ServiceProviderRepository serviceProviderRepository,
                                      UserRepository userRepository,
                                      SecurityUtils securityUtils,
                                      ModelMapper modelMapper) {
        this.serviceProviderRepository = serviceProviderRepository;
        this.userRepository = userRepository;
        this.securityUtils = securityUtils;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceProviderProfileResponseDTO getCurrentProviderProfile() {
        Long userId = securityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        ServiceProvider provider = serviceProviderRepository.findByUser(user)
                .orElse(null);

        return mapToResponseDTO(user, provider);
    }

    @Override
    public ServiceProviderProfileResponseDTO updateProviderProfile(ServiceProviderProfileRequestDTO profileRequest) {
        Long userId = securityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        ServiceProvider provider = serviceProviderRepository.findByUser(user)
                .orElse(new ServiceProvider(
                        user,
                        profileRequest.getBusinessName(),
                        profileRequest.getDescription(),
                        profileRequest.getAddress(),
                        profileRequest.getCity(),
                        profileRequest.getState(),
                        profileRequest.getPincode(),
                        profileRequest.getExperienceYears()
                ));

        provider.setBusinessName(profileRequest.getBusinessName());
        provider.setDescription(profileRequest.getDescription());
        provider.setAddress(profileRequest.getAddress());
        provider.setCity(profileRequest.getCity());
        provider.setState(profileRequest.getState());
        provider.setPincode(profileRequest.getPincode());
        provider.setExperienceYears(profileRequest.getExperienceYears());

        ServiceProvider saved = serviceProviderRepository.save(provider);
        return mapToResponseDTO(user, saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceProviderProfileResponseDTO getProviderById(Long providerId) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Service Provider not found with id: " + providerId));
        return mapToResponseDTO(provider.getUser(), provider);
    }

    private ServiceProviderProfileResponseDTO mapToResponseDTO(User user, ServiceProvider provider) {
        ServiceProviderProfileResponseDTO dto = new ServiceProviderProfileResponseDTO();
        dto.setUserId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setStatus(user.getStatus());

        if (provider != null) {
            dto.setProviderId(provider.getId());
            dto.setBusinessName(provider.getBusinessName());
            dto.setDescription(provider.getDescription());
            dto.setAddress(provider.getAddress());
            dto.setCity(provider.getCity());
            dto.setState(provider.getState());
            dto.setPincode(provider.getPincode());
            dto.setExperienceYears(provider.getExperienceYears());
        }

        return dto;
    }
}
