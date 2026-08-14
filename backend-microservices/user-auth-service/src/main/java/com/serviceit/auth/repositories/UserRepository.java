package com.serviceit.auth.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.serviceit.auth.entities.User;
import com.serviceit.auth.entities.UserRole;
import com.serviceit.auth.entities.UserStatus;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
    
    List<User> findByRole(UserRole role);

    List<User> findByRoleAndStatus(UserRole role, UserStatus status);
    
    Optional<User> findByVerificationToken(String verificationToken);

    boolean existsByVerificationToken(String verificationToken);

    Optional<User> findByResetPasswordToken(String resetPasswordToken);
}
