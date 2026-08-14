package com.serviceit.auth.dtos;

import com.serviceit.auth.constants.ValidationConstants;
import com.serviceit.auth.entities.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserRegisterRequestDTO {

    @NotBlank(message = "Full Name is required")
    @Size(min = 3, max = 100, message = "Full Name must be between 3 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid Email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = ValidationConstants.PHONE_REGEX,
            message = "Phone number must be exactly 10 digits and start with 6, 7, 8, or 9"
    )
    private String phone;

    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = ValidationConstants.PASSWORD_REGEX,
            message = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    )
    private String password;

    @NotNull(message = "Role is required")
    private UserRole role;

    public UserRegisterRequestDTO() {}

    public UserRegisterRequestDTO(String fullName, String email, String phone, String password, UserRole role) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
