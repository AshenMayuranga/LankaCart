package com.lankacart.orderservice.service;

import com.lankacart.orderservice.entity.Order;
import com.lankacart.orderservice.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderBusinessServiceTest {

    private static final String AUTH_HEADER = "Bearer test-token";

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private OrderBusinessService orderBusinessService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(orderBusinessService, "userServiceBaseUrl", "http://user-service");
        ReflectionTestUtils.setField(orderBusinessService, "productServiceBaseUrl", "http://product-service");
        ReflectionTestUtils.setField(orderBusinessService, "inventoryServiceBaseUrl", "http://inventory-service");
    }

    @Test
    void createOrderSucceedsWhenDependenciesAreValid() {
        Order order = validOrder();

        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("ok"));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order saved = invocation.getArgument(0);
            saved.setId(55L);
            return saved;
        });

        Order saved = orderBusinessService.createOrder(order, AUTH_HEADER);

        assertEquals(55L, saved.getId());
        assertNotNull(saved.getOrderDate());
        verify(orderRepository).save(order);
        verify(restTemplate, atLeast(3)).exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(String.class));
    }

    @Test
    void createOrderFailsWhenAuthorizationHeaderMissing() {
        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> orderBusinessService.createOrder(validOrder(), null)
        );

        assertEquals(HttpStatus.UNAUTHORIZED.value(), ex.getStatusCode().value());
        verifyNoInteractions(restTemplate, orderRepository);
    }

    @Test
    void createOrderFailsWhenUserDoesNotExist() {
        when(restTemplate.exchange(contains("/users/"), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenThrow(notFoundException());

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> orderBusinessService.createOrder(validOrder(), AUTH_HEADER)
        );

        assertEquals(HttpStatus.BAD_REQUEST.value(), ex.getStatusCode().value());
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void createOrderRollsBackInventoryWhenSaveFails() {
        Order order = validOrder();
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("ok"));
        when(orderRepository.save(any(Order.class))).thenThrow(new RuntimeException("db failure"));

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> orderBusinessService.createOrder(order, AUTH_HEADER)
        );

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getStatusCode().value());

        ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);
        verify(restTemplate, atLeast(4)).exchange(urlCaptor.capture(), any(HttpMethod.class), any(HttpEntity.class), eq(String.class));
        List<String> urls = urlCaptor.getAllValues();
        assertTrue(urls.stream().anyMatch(url -> url.contains("/decrement") && url.contains("quantity=2")));
        assertTrue(urls.stream().anyMatch(url -> url.contains("/increment") && url.contains("quantity=2")));
    }

    private Order validOrder() {
        Order order = new Order();
        order.setUserId(1L);
        order.setProductId(2L);
        order.setQuantity(2);
        order.setTotalPrice(new BigDecimal("2000.00"));
        order.setStatus("PLACED");
        order.setShippingAddress("Colombo");
        return order;
    }

    private HttpClientErrorException notFoundException() {
        return HttpClientErrorException.create(
                HttpStatus.NOT_FOUND,
                "Not Found",
                HttpHeaders.EMPTY,
                new byte[0],
                StandardCharsets.UTF_8
        );
    }
}
