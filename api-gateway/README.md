# API Gateway

Spring Cloud Gateway service that acts as the single entry point for all LankaCart microservices. Routes incoming requests to the appropriate backend service and aggregates Swagger documentation from all services.

---

## Details

| Property | Value |
|----------|-------|
| Port | **8086** |
| Framework | Spring Cloud Gateway (WebFlux / reactive) |
| Spring Boot | 3.2.12 |
| Spring Cloud | 2023.0.3 |

---

## Routing Table

| Path Pattern | Routed To | Service Port |
|-------------|-----------|-------------|
| `/users/**` | User Service | 8081 |
| `/products/**` | Product Service | 8082 |
| `/orders/**` | Order Service | 8083 |
| `/inventory/**` | Inventory Service | 8084 |
| `/api-docs/user-service` | User Service `/v3/api-docs` | 8081 |
| `/api-docs/product-service` | Product Service `/v3/api-docs` | 8082 |
| `/api-docs/order-service` | Order Service `/v3/api-docs` | 8083 |
| `/api-docs/inventory-service` | Inventory Service `/v3/api-docs` | 8084 |

---

## Swagger UI

The gateway aggregates API documentation from all services into a single Swagger UI:

```
http://localhost:8086/swagger-ui.html
```

Use the **"Select a definition"** dropdown (top right) to switch between services:
- User Service
- Product Service
- Order Service
- Inventory Service

---

## Running

From the project root:

```bash
./gradlew :api-gateway:bootRun
```

> **Note:** Start the 4 backend services before starting the gateway.

---

## Project Structure

```
api-gateway/
└── src/main/
    ├── java/com/lankacart/apigateway/
    │   ├── ApiGatewayApplication.java
    │   └── config/
    │       └── OpenApiConfig.java      # Swagger aggregation config
    └── resources/
        └── application.properties      # Routes + SpringDoc config
```

---

## Key Configuration

```properties
server.port=8086

# Route example
spring.cloud.gateway.routes[0].id=user-service
spring.cloud.gateway.routes[0].uri=http://localhost:8081
spring.cloud.gateway.routes[0].predicates[0]=Path=/users/**

# Swagger aggregation
springdoc.swagger-ui.urls[0].name=User Service
springdoc.swagger-ui.urls[0].url=/api-docs/user-service
```
