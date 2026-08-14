package com.serviceit.auth.services;

import com.serviceit.auth.dtos.ConsumerProfileRequestDTO;
import com.serviceit.auth.dtos.ConsumerProfileResponseDTO;

public interface ConsumerService {

    ConsumerProfileResponseDTO getCurrentConsumerProfile();

    ConsumerProfileResponseDTO updateConsumerProfile(ConsumerProfileRequestDTO profileRequest);

    ConsumerProfileResponseDTO getConsumerById(Long consumerId);
}
