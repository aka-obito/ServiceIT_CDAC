package com.serviceit.auth.dtos;

import com.serviceit.auth.constants.ValidationConstants;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ResetPasswordRequestDTO {

    @NotBlank(message = "Reset token is required.")
    private String token;

    @NotBlank(message = "New password is required.")
    @Pattern(
            regexp = ValidationConstants.PASSWORD_REGEX,
            message = "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character."
    )
    private String newPassword;

    public ResetPasswordRequestDTO() {}

    public ResetPasswordRequestDTO(String token, String newPassword) {
        this.token = token;
        this.newPassword = newPassword;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
