package com.lankacart.apigateway.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/gateway")
@Tag(name = "API Gateway", description = "API Gateway management and routing information")
public class GatewayController {

    private final RouteLocator routeLocator;
    private final int serverPort;
    private final String userServiceBaseUrl;
    private final String productServiceBaseUrl;
    private final String orderServiceBaseUrl;
    private final String inventoryServiceBaseUrl;

    public GatewayController(
            RouteLocator routeLocator,
            @Value("${server.port}") int serverPort,
            @Value("${services.user.base-url}") String userServiceBaseUrl,
            @Value("${services.product.base-url}") String productServiceBaseUrl,
            @Value("${services.order.base-url}") String orderServiceBaseUrl,
            @Value("${services.inventory.base-url}") String inventoryServiceBaseUrl) {
        this.routeLocator = routeLocator;
        this.serverPort = serverPort;
        this.userServiceBaseUrl = userServiceBaseUrl;
        this.productServiceBaseUrl = productServiceBaseUrl;
        this.orderServiceBaseUrl = orderServiceBaseUrl;
        this.inventoryServiceBaseUrl = inventoryServiceBaseUrl;
    }

    @GetMapping("/health")
    @Operation(summary = "Gateway health check", description = "Returns the current health status of the API Gateway")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "service", "LankaCart API Gateway",
                "timestamp", LocalDateTime.now().toString()
        );
    }

    @GetMapping("/routes")
    @Operation(summary = "List all registered routes", description = "Returns all routes configured in the API Gateway with their predicates and filters")
    public Flux<Map<String, Object>> routes() {
        return routeLocator.getRoutes()
                .map(route -> Map.of(
                        "id", route.getId(),
                        "uri", route.getUri().toString(),
                        "predicates", route.getPredicate().toString()
                ));
    }

    @GetMapping("/info")
    @Operation(summary = "Gateway service info", description = "Returns general information about the API Gateway and registered microservices")
    public Map<String, Object> info() {
        return Map.of(
                "gateway", "LankaCart API Gateway",
                "version", "1.0.0",
                "port", serverPort,
                "services", Map.of(
                        "user-service", userServiceBaseUrl,
                        "product-service", productServiceBaseUrl,
                        "order-service", orderServiceBaseUrl,
                        "inventory-service", inventoryServiceBaseUrl
                ),
                "publicPaths", new String[]{
                        "/auth/login", "/auth/register",
                        "/products (GET)", "/gateway/**",
                        "/swagger-ui/**", "/api-docs/**"
                }
        );
    }
}
