package com.serviceit.auth.services;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.serviceit.auth.dtos.ConsumerProfileRequestDTO;
import com.serviceit.auth.dtos.ConsumerProfileResponseDTO;
import com.serviceit.auth.entities.Consumer;
import com.serviceit.auth.entities.User;
import com.serviceit.auth.exceptions.ResourceNotFoundException;
import com.serviceit.auth.repositories.ConsumerRepository;
import com.serviceit.auth.repositories.UserRepository;
import com.serviceit.auth.security.SecurityUtils;

@Service
@Transactional
public class ConsumerServiceImpl implements ConsumerService {

    private final ConsumerRepository consumerRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final ModelMapper modelMapper;

    public ConsumerServiceImpl(ConsumerRepository consumerRepository,
                               UserRepository userRepository,
                               SecurityUtils securityUtils,
                               ModelMapper modelMapper) {
        this.consumerRepository = consumerRepository;
        this.userRepository = userRepository;
        this.securityUtils = securityUtils;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public ConsumerProfileResponseDTO getCurrentConsumerProfile() {
        Long userId = securityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Consumer consumer = consumerRepository.findByUser(user)
                .orElse(null);

        return mapToResponseDTO(user, consumer);
    }

    @Override
    public ConsumerProfileResponseDTO updateConsumerProfile(ConsumerProfileRequestDTO profileRequest) {
        Long userId = securityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Consumer consumer = consumerRepository.findByUser(user)
                .orElse(new Consumer(user, profileRequest.getAddress(), profileRequest.getCity(),
                        profileRequest.getState(), profileRequest.getPincode()));

        consumer.setAddress(profileRequest.getAddress());
        consumer.setCity(profileRequest.getCity());
        consumer.setState(profileRequest.getState());
        consumer.setPincode(profileRequest.getPincode());

        Consumer savedConsumer = consumerRepository.save(consumer);
        return mapToResponseDTO(user, savedConsumer);
    }

    @Override
    @Transactional(readOnly = true)
    public ConsumerProfileResponseDTO getConsumerById(Long consumerId) {
        Consumer consumer = consumerRepository.findById(consumerId)
                .orElseThrow(() -> new ResourceNotFoundException("Consumer not found with id: " + consumerId));
        return mapToResponseDTO(consumer.getUser(), consumer);
    }

    private ConsumerProfileResponseDTO mapToResponseDTO(User user, Consumer consumer) {
        ConsumerProfileResponseDTO dto = new ConsumerProfileResponseDTO();
        dto.setUserId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());

        if (consumer != null) {
            dto.setConsumerId(consumer.getId());
            dto.setAddress(consumer.getAddress());
            dto.setCity(consumer.getCity());
            dto.setState(consumer.getState());
            dto.setPincode(consumer.getPincode());
        }

        return dto;
    }
}
