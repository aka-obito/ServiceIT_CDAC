package com.serviceit.auth.services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.serviceit.auth.dtos.ForgotPasswordRequestDTO;
import com.serviceit.auth.dtos.ResetPasswordRequestDTO;
import com.serviceit.auth.dtos.UserRegisterRequestDTO;
import com.serviceit.auth.dtos.UserResponseDTO;
import com.serviceit.auth.dtos.UserUpdateRequestDTO;
import com.serviceit.auth.entities.User;
import com.serviceit.auth.entities.UserRole;
import com.serviceit.auth.entities.UserStatus;
import com.serviceit.auth.exceptions.DuplicateResourceException;
import com.serviceit.auth.exceptions.InvalidOperationException;
import com.serviceit.auth.exceptions.ResourceNotFoundException;
import com.serviceit.auth.feign.NotificationServiceClient;
import com.serviceit.auth.feign.dto.EmailNotificationRequestDTO;
import com.serviceit.auth.repositories.UserRepository;
import com.serviceit.auth.security.SecurityUtils;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtils securityUtils;
    private final NotificationServiceClient notificationServiceClient;
    private final ModelMapper modelMapper;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           SecurityUtils securityUtils,
                           NotificationServiceClient notificationServiceClient,
                           ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.securityUtils = securityUtils;
        this.notificationServiceClient = notificationServiceClient;
        this.modelMapper = modelMapper;
    }

    @Override
    public UserResponseDTO registerUser(UserRegisterRequestDTO registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + registerRequest.getEmail());
        }

        if (userRepository.existsByPhone(registerRequest.getPhone())) {
            throw new DuplicateResourceException("Phone number already registered: " + registerRequest.getPhone());
        }

        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole());

        if (registerRequest.getRole() == UserRole.CONSUMER) {
            user.setStatus(UserStatus.INACTIVE);
            user.setEmailVerified(false);
            user.setVerificationToken(UUID.randomUUID().toString());
        } else if (registerRequest.getRole() == UserRole.PROVIDER) {
            user.setStatus(UserStatus.PENDING);
            user.setEmailVerified(false);
            user.setVerificationToken(UUID.randomUUID().toString());
        } else {
            user.setStatus(UserStatus.ACTIVE);
            user.setEmailVerified(true);
            user.setVerificationToken(null);
        }

        User savedUser = userRepository.save(user);

        if (!savedUser.isEmailVerified() && savedUser.getVerificationToken() != null) {
            try {
                String verifyLink = "http://localhost:5173/verify-email?token=" + savedUser.getVerificationToken();
                notificationServiceClient.sendEmail(EmailNotificationRequestDTO.builder()
                        .type("VERIFICATION")
                        .to(savedUser.getEmail())
                        .fullName(savedUser.getFullName())
                        .role(savedUser.getRole().name())
                        .link(verifyLink)
                        .build());
            } catch (Exception e) {
                log.warn("Could not dispatch async email verification via Notification Microservice: {}", e.getMessage());
            }
        }

        return modelMapper.map(savedUser, UserResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return modelMapper.map(user, UserResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return modelMapper.map(user, UserResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getCurrentUserProfile() {
        Long userId = securityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return modelMapper.map(user, UserResponseDTO.class);
    }

    @Override
    public UserResponseDTO updateCurrentUserProfile(UserUpdateRequestDTO updateRequest) {
        Long userId = securityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!user.getPhone().equals(updateRequest.getPhone()) &&
                userRepository.existsByPhone(updateRequest.getPhone())) {
            throw new DuplicateResourceException("Phone number already in use: " + updateRequest.getPhone());
        }

        user.setFullName(updateRequest.getFullName());
        user.setPhone(updateRequest.getPhone());

        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserResponseDTO.class);
    }

    @Override
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new InvalidOperationException("Invalid or expired email verification token."));

        user.setEmailVerified(true);
        user.setVerificationToken(null);

        if (user.getRole() == UserRole.CONSUMER) {
            user.setStatus(UserStatus.ACTIVE);
        }

        userRepository.save(user);

        try {
            notificationServiceClient.sendEmail(EmailNotificationRequestDTO.builder()
                    .type("WELCOME")
                    .to(user.getEmail())
                    .fullName(user.getFullName())
                    .build());
        } catch (Exception e) {
            log.warn("Could not dispatch welcome email: {}", e.getMessage());
        }
    }

    @Override
    public void forgotPassword(ForgotPasswordRequestDTO request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetPasswordToken(token);
            user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));
            userRepository.save(user);

            try {
                String resetLink = "http://localhost:5173/reset-password?token=" + token;
                notificationServiceClient.sendEmail(EmailNotificationRequestDTO.builder()
                        .type("PASSWORD_RESET")
                        .to(user.getEmail())
                        .fullName(user.getFullName())
                        .link(resetLink)
                        .build());
            } catch (Exception e) {
                log.warn("Could not dispatch reset password email: {}", e.getMessage());
            }
        });
    }

    @Override
    public void resetPassword(ResetPasswordRequestDTO request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new InvalidOperationException("Invalid or expired password reset token."));

        if (user.getResetPasswordTokenExpiry() == null || user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidOperationException("Password reset token has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
    }
}
