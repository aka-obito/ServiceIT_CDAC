package com.serviceit.auth.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.serviceit.auth.entities.Consumer;
import com.serviceit.auth.entities.User;

public interface ConsumerRepository extends JpaRepository<Consumer, Long> {

    Optional<Consumer> findByUser(User user);

    Optional<Consumer> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
