package com.lankacart.orderservice.service;

import com.lankacart.orderservice.entity.Order;
import com.lankacart.orderservice.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;

@Service
public class OrderBusinessService {

    private static final Logger log = LoggerFactory.getLogger(OrderBusinessService.class);

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    @Value("${services.user.base-url:http://localhost:8081}")
    private String userServiceBaseUrl;

    @Value("${services.product.base-url:http://localhost:8082}")
    private String productServiceBaseUrl;

    @Value("${services.inventory.base-url:http://localhost:8084}")
    private String inventoryServiceBaseUrl;

    public OrderBusinessService(OrderRepository orderRepository, RestTemplate restTemplate) {
        this.orderRepository = orderRepository;
        this.restTemplate = restTemplate;
    }

    public Order createOrder(Order orderRequest, String authorizationHeader) {
        validateAuthHeader(authorizationHeader);
        validateUserExists(orderRequest.getUserId(), authorizationHeader);
        validateProductExists(orderRequest.getProductId(), authorizationHeader);

        reserveInventory(orderRequest.getProductId(), orderRequest.getQuantity(), authorizationHeader);

        try {
            orderRequest.setId(null);
            orderRequest.setOrderDate(LocalDateTime.now());
            return orderRepository.save(orderRequest);
        } catch (RuntimeException ex) {
            releaseInventory(orderRequest.getProductId(), orderRequest.getQuantity(), authorizationHeader);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Order creation failed");
        }
    }

    private void validateAuthHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authorization header is required");
        }
    }

    private void validateUserExists(Long userId, String authorizationHeader) {
        String url = userServiceBaseUrl + "/users/" + userId;
        try {
            restTemplate.exchange(url, HttpMethod.GET, authorizedEntity(authorizationHeader), String.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Referenced user does not exist");
        } catch (HttpClientErrorException.Unauthorized ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized to validate user");
        } catch (HttpClientErrorException.Forbidden ex) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden to validate user");
        } catch (RestClientException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to validate user");
        }
    }

    private void validateProductExists(Long productId, String authorizationHeader) {
        String url = productServiceBaseUrl + "/products/" + productId;
        try {
            restTemplate.exchange(url, HttpMethod.GET, authorizedEntity(authorizationHeader), String.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Referenced product does not exist");
        } catch (HttpClientErrorException.Unauthorized ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized to validate product");
        } catch (HttpClientErrorException.Forbidden ex) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden to validate product");
        } catch (RestClientException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to validate product");
        }
    }

    private void reserveInventory(Long productId, Integer quantity, String authorizationHeader) {
        String url = UriComponentsBuilder
                .fromHttpUrl(inventoryServiceBaseUrl + "/inventory/product/{productId}/decrement")
                .queryParam("quantity", quantity)
                .buildAndExpand(productId)
                .toUriString();
        try {
            restTemplate.exchange(url, HttpMethod.POST, authorizedEntity(authorizationHeader), String.class);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inventory not found for referenced product");
        } catch (HttpClientErrorException.Unauthorized ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized to reserve inventory");
        } catch (HttpClientErrorException.Forbidden ex) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden to reserve inventory");
        } catch (HttpClientErrorException.BadRequest ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient inventory for requested quantity");
        } catch (RestClientException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to reserve inventory");
        }
    }

    private void releaseInventory(Long productId, Integer quantity, String authorizationHeader) {
        String url = UriComponentsBuilder
                .fromHttpUrl(inventoryServiceBaseUrl + "/inventory/product/{productId}/increment")
                .queryParam("quantity", quantity)
                .buildAndExpand(productId)
                .toUriString();
        try {
            restTemplate.exchange(url, HttpMethod.POST, authorizedEntity(authorizationHeader), String.class);
        } catch (RestClientException ex) {
            log.error("Inventory rollback failed for productId={}, quantity={}", productId, quantity);
        }
    }

    private HttpEntity<Void> authorizedEntity(String authorizationHeader) {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, authorizationHeader);
        return new HttpEntity<>(headers);
    }
}
