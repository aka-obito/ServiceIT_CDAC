package com.serviceit.auth.services;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.serviceit.auth.dtos.LoginResponseDTO;
import com.serviceit.auth.dtos.UserLoginRequestDTO;
import com.serviceit.auth.dtos.UserRegisterRequestDTO;
import com.serviceit.auth.dtos.UserResponseDTO;
import com.serviceit.auth.entities.User;
import com.serviceit.auth.entities.UserStatus;
import com.serviceit.auth.exceptions.InvalidOperationException;
import com.serviceit.auth.feign.AuditLogServiceClient;
import com.serviceit.auth.repositories.UserRepository;
import com.serviceit.auth.security.CustomUserDetails;
import com.serviceit.auth.security.JwtTokenProvider;

@Service
@Transactional
public class AuthenticationServiceImpl implements AuthenticationService {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationServiceImpl.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final UserRepository userRepository;
    private final AuditLogServiceClient auditLogServiceClient;
    private final ModelMapper modelMapper;

    public AuthenticationServiceImpl(AuthenticationManager authenticationManager,
                                      JwtTokenProvider jwtTokenProvider,
                                      UserService userService,
                                      UserRepository userRepository,
                                      AuditLogServiceClient auditLogServiceClient,
                                      ModelMapper modelMapper) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.userRepository = userRepository;
        this.auditLogServiceClient = auditLogServiceClient;
        this.modelMapper = modelMapper;
    }

    @Override
    public UserResponseDTO register(UserRegisterRequestDTO registerRequest) {
        return userService.registerUser(registerRequest);
    }

    @Override
    public LoginResponseDTO login(UserLoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new InvalidOperationException("User not found"));

        if (!user.isEmailVerified()) {
            throw new InvalidOperationException("Please verify your email address before logging in. Check your inbox for the verification link.");
        }

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new InvalidOperationException("Your account is inactive. Please contact support.");
        }

        if (user.getStatus() == UserStatus.PENDING) {
            throw new InvalidOperationException("Your account is pending admin approval. You will receive an email once approved.");
        }

        if (user.getStatus() == UserStatus.REJECTED) {
            throw new InvalidOperationException("Your service provider application was rejected. Please contact support.");
        }

        String token = jwtTokenProvider.generateToken(authentication);

        // Record Audit Log for successful login
        try {
            auditLogServiceClient.recordAuditLog(new AuditLogServiceClient.AuditLogRequestDTO(
                    "USER_LOGIN",
                    user.getEmail(),
                    user.getRole().name(),
                    "User",
                    user.getId(),
                    "User " + user.getFullName() + " logged in successfully"
            ));
        } catch (Exception e) {
            log.warn("Could not dispatch async login audit log: {}", e.getMessage());
        }

        return new LoginResponseDTO(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus()
        );
    }
}
