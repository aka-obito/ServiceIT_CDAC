package com.serviceit.auth.services;

import com.serviceit.auth.dtos.LoginResponseDTO;
import com.serviceit.auth.dtos.UserLoginRequestDTO;
import com.serviceit.auth.dtos.UserRegisterRequestDTO;
import com.serviceit.auth.dtos.UserResponseDTO;

public interface AuthenticationService {

    UserResponseDTO register(UserRegisterRequestDTO registerRequest);

    LoginResponseDTO login(UserLoginRequestDTO loginRequest);
}
