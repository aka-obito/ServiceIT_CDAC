package com.serviceit.auth.services;

import java.util.List;

import com.serviceit.auth.dtos.AdminProviderStatusUpdateDTO;
import com.serviceit.auth.dtos.ServiceProviderProfileResponseDTO;
import com.serviceit.auth.dtos.UserResponseDTO;

public interface AdminService {

    List<UserResponseDTO> getAllUsers();

    void toggleUserStatus(Long userId);

    List<ServiceProviderProfileResponseDTO> getPendingProviders();

    ServiceProviderProfileResponseDTO updateProviderStatus(Long providerId, AdminProviderStatusUpdateDTO statusUpdateDTO);
}
