package com.serviceit.auth.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.serviceit.auth.entities.ServiceProvider;
import com.serviceit.auth.entities.User;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {

    Optional<ServiceProvider> findByUser(User user);

    Optional<ServiceProvider> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
