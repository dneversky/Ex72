package org.dneversky.gateway.client;

import org.dneversky.gateway.config.UserRabbitMQConfig;
import org.dneversky.gateway.exception.EntityExistsException;
import org.dneversky.gateway.exception.EntityNotFoundException;
import org.dneversky.gateway.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserClient {

    private static final Logger logger = LoggerFactory.getLogger(UserClient.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public List<User> getAllUsers() {
        logger.info("Sending message with 1");
        List<User> response = rabbitTemplate.convertSendAndReceiveAsType(
                UserRabbitMQConfig.RPC_EXCHANGE, UserRabbitMQConfig.RPC_GET_USERS, 1,
                new ParameterizedTypeReference<List<User>>() {});
        logger.info("Getting response: {}", response);

        return response;
    }

    public User getUserById(Long id) {
        logger.info("Sending message with id: {}", id);
        User response = rabbitTemplate.convertSendAndReceiveAsType(
                UserRabbitMQConfig.RPC_EXCHANGE, UserRabbitMQConfig.RPC_GET_USER_BY_ID, id,
                new ParameterizedTypeReference<User>() {});
        logger.info("Getting response: {}", response);
        if(response == null) {
            throw new EntityNotFoundException("User with id " + id + " not found.");
        }
        return response;
    }

    public User getUserByUsername(String username) {
        logger.info("Sending message with username: {}", username);
        User response = rabbitTemplate.convertSendAndReceiveAsType(
                UserRabbitMQConfig.RPC_EXCHANGE, UserRabbitMQConfig.RPC_GET_USER_BY_USERNAME, username,
                new ParameterizedTypeReference<User>() {});
        logger.info("Getting response: {}", response);
        if(response == null) {
            throw new EntityNotFoundException("User with username " + username + " not found.");
        }

        return response;
    }

    public User saveUser(User user) {
        logger.info("Sending message with user: {}", user);
        User response = rabbitTemplate.convertSendAndReceiveAsType(
                UserRabbitMQConfig.RPC_EXCHANGE, UserRabbitMQConfig.RPC_SAVE_USER, user,
                new ParameterizedTypeReference<User>() {});
        logger.info("Getting response: {}", response);
        if(response == null) {
            throw new EntityExistsException("User with username " + user.getUsername() + " already exists.");
        }

        return response;
    }
}

//    public void sendAndForget() {
//        CarDto carDto = CarDto.builder()
//                // ...
//                .build();
//
//        UUID correlationId = UUID.randomUUID();
//
//        registrationService.saveCar(carDto, correlationId);
//
//        MessagePostProcessor messagePostProcessor = message -> {
//            MessageProperties messageProperties
//                    = message.getMessageProperties();
//            messageProperties.setReplyTo(replyQueue.getName());
//            messageProperties.setCorrelationId(correlationId.toString());
//            return message;
//        };
//
//        template.convertAndSend(directExchange.getName(),
//                "old.car",
//                carDto,
//                messagePostProcessor);
//    }