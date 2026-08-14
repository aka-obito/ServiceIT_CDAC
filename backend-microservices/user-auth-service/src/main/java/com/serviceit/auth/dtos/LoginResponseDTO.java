package com.serviceit.auth.dtos;

import com.serviceit.auth.entities.UserRole;
import com.serviceit.auth.entities.UserStatus;

public class LoginResponseDTO {

    private String token;
    private Long userId;
    private String fullName;
    private String email;
    private UserRole role;
    private UserStatus status;

    public LoginResponseDTO() {}

    public LoginResponseDTO(String token, Long userId, String fullName, String email, UserRole role, UserStatus status) {
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}
