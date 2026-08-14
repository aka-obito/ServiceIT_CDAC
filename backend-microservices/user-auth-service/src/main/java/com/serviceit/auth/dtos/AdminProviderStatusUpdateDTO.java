package com.serviceit.auth.dtos;

import com.serviceit.auth.entities.UserStatus;
import jakarta.validation.constraints.NotNull;

public class AdminProviderStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private UserStatus status;

    public AdminProviderStatusUpdateDTO() {}

    public AdminProviderStatusUpdateDTO(UserStatus status) {
        this.status = status;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}
