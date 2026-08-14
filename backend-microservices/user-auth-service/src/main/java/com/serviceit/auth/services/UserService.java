package com.serviceit.auth.services;

import java.util.List;

import com.serviceit.auth.dtos.ForgotPasswordRequestDTO;
import com.serviceit.auth.dtos.ResetPasswordRequestDTO;
import com.serviceit.auth.dtos.UserRegisterRequestDTO;
import com.serviceit.auth.dtos.UserResponseDTO;
import com.serviceit.auth.dtos.UserUpdateRequestDTO;

public interface UserService {

    UserResponseDTO registerUser(UserRegisterRequestDTO registerRequest);

    UserResponseDTO getUserById(Long userId);

    UserResponseDTO getUserByEmail(String email);

    UserResponseDTO getCurrentUserProfile();

    UserResponseDTO updateCurrentUserProfile(UserUpdateRequestDTO updateRequest);

    void verifyEmail(String token);

    void forgotPassword(ForgotPasswordRequestDTO request);

    void resetPassword(ResetPasswordRequestDTO request);
}
