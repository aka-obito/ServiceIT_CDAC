package com.serviceit.auth.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.serviceit.auth.dtos.AdminProviderStatusUpdateDTO;
import com.serviceit.auth.dtos.ServiceProviderProfileResponseDTO;
import com.serviceit.auth.dtos.UserResponseDTO;
import com.serviceit.auth.entities.ServiceProvider;
import com.serviceit.auth.entities.User;
import com.serviceit.auth.entities.UserRole;
import com.serviceit.auth.entities.UserStatus;
import com.serviceit.auth.exceptions.ResourceNotFoundException;
import com.serviceit.auth.feign.NotificationServiceClient;
import com.serviceit.auth.feign.dto.EmailNotificationRequestDTO;
import com.serviceit.auth.repositories.ServiceProviderRepository;
import com.serviceit.auth.repositories.UserRepository;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminServiceImpl.class);

    private final UserRepository userRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final NotificationServiceClient notificationServiceClient;
    private final ModelMapper modelMapper;

    public AdminServiceImpl(UserRepository userRepository,
                            ServiceProviderRepository serviceProviderRepository,
                            NotificationServiceClient notificationServiceClient,
                            ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.notificationServiceClient = notificationServiceClient;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setStatus(user.getStatus() == UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceProviderProfileResponseDTO> getPendingProviders() {
        return userRepository.findByRoleAndStatus(UserRole.PROVIDER, UserStatus.PENDING).stream()
                .map(user -> {
                    ServiceProvider provider = serviceProviderRepository.findByUser(user)
                            .orElse(null);
                    return mapToProviderResponseDTO(user, provider);
                })
                .collect(Collectors.toList());
    }

    @Override
    public ServiceProviderProfileResponseDTO updateProviderStatus(Long id, AdminProviderStatusUpdateDTO statusUpdateDTO) {
        User user = userRepository.findById(id).orElse(null);
        ServiceProvider provider = null;

        if (user != null) {
            provider = serviceProviderRepository.findByUser(user).orElse(null);
        } else {
            provider = serviceProviderRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
            user = provider.getUser();
        }

        user.setStatus(statusUpdateDTO.getStatus());
        userRepository.save(user);

        if (statusUpdateDTO.getStatus() == UserStatus.ACTIVE) {
            try {
                notificationServiceClient.sendEmail(EmailNotificationRequestDTO.builder()
                        .type("PROVIDER_APPROVAL")
                        .to(user.getEmail())
                        .fullName(user.getFullName())
                        .businessName(provider != null ? provider.getBusinessName() : "")
                        .build());
            } catch (Exception e) {
                log.warn("Could not dispatch provider approval notification: {}", e.getMessage());
            }
        }

        return mapToProviderResponseDTO(user, provider);
    }

    private ServiceProviderProfileResponseDTO mapToProviderResponseDTO(User user, ServiceProvider provider) {
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
