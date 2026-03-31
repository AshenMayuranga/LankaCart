# LankaCart Backend Running Guide

## 1. Project Overview

LankaCart is a Gradle multi-module Spring Boot microservices backend defined in `settings.gradle` with these modules:

- `api-gateway`
- `user-service`
- `product-service`
- `order-service`
- `inventory-service`

The API Gateway is the entry point and routes requests to downstream services. Each business service runs on its own port and (except gateway) uses PostgreSQL.

## 2. Services in the Project

| Service | Port | Description |
|---|---:|---|
| `api-gateway` | 8086 | Spring Cloud Gateway routing, JWT gatekeeping, gateway endpoints, Swagger aggregation |
| `user-service` | 8081 | Auth (`/auth/login`, `/auth/register`) and user CRUD (`/users/**`) |
| `product-service` | 8082 | Product CRUD (`/products/**`) |
| `order-service` | 8083 | Order CRUD + order business flow (user/product/inventory validation and stock decrement) |
| `inventory-service` | 8084 | Inventory CRUD + stock endpoints by product (`increment` / `decrement`) |

## 3. How to Run All Services

### Step 1: Build from root

```bash
./gradlew clean build
```

### Step 2: Start services

Option A (Windows helper script from root):

```powershell
.\start-all-services.bat
```

Option B (manual, one command):

```bash
./gradlew :user-service:bootRun :product-service:bootRun :order-service:bootRun :inventory-service:bootRun :api-gateway:bootRun --parallel
```

Option C (manual, separate terminals):

```bash
./gradlew :user-service:bootRun
./gradlew :product-service:bootRun
./gradlew :order-service:bootRun
./gradlew :inventory-service:bootRun
./gradlew :api-gateway:bootRun
```

Recommended start order: user/product/order/inventory first, gateway last.

## 4. Database Requirements

Services with database config and default DB names:

| Service | JDBC URL (default) | DB Name | Username (default) | Password (default) |
|---|---|---|---|---|
| `user-service` | `jdbc:postgresql://localhost:5432/user_service_db` | `user_service_db` | `postgres` | `postgres` |
| `product-service` | `jdbc:postgresql://localhost:5432/product_service_db` | `product_service_db` | `postgres` | `postgres` |
| `order-service` | `jdbc:postgresql://localhost:5432/order_service_db` | `order_service_db` | `postgres` | `postgres` |
| `inventory-service` | `jdbc:postgresql://localhost:5432/inventory_service_db` | `inventory_service_db` | `postgres` | `postgres` |

Gateway does not have a datasource.

Create required databases before startup:

```sql
CREATE DATABASE user_service_db;
CREATE DATABASE product_service_db;
CREATE DATABASE order_service_db;
CREATE DATABASE inventory_service_db;
```

## 5. Swagger / OpenAPI Access

All services use customized SpringDoc paths:

- `springdoc.swagger-ui.path=/swagger-ui.html`
- `springdoc.api-docs.path=/api-docs`

### Swagger UI URLs

| Service | Swagger UI URL |
|---|---|
| API Gateway | `http://localhost:8086/swagger-ui.html` |
| User Service | `http://localhost:8081/swagger-ui.html` |
| Product Service | `http://localhost:8082/swagger-ui.html` |
| Order Service | `http://localhost:8083/swagger-ui.html` |
| Inventory Service | `http://localhost:8084/swagger-ui.html` |

### OpenAPI JSON URLs

| Service | OpenAPI JSON URL |
|---|---|
| API Gateway | `http://localhost:8086/api-docs` |
| User Service | `http://localhost:8081/api-docs` |
| Product Service | `http://localhost:8082/api-docs` |
| Order Service | `http://localhost:8083/api-docs` |
| Inventory Service | `http://localhost:8084/api-docs` |

### Gateway proxied service docs

- `http://localhost:8086/api-docs/user-service`
- `http://localhost:8086/api-docs/product-service`
- `http://localhost:8086/api-docs/order-service`
- `http://localhost:8086/api-docs/inventory-service`

## 6. Gateway Swagger Aggregation

Yes, the gateway exposes aggregated documentation.

- Aggregated endpoint: `http://localhost:8086/api-docs/aggregated`
- Swagger UI at gateway (`/swagger-ui.html`) is configured with multiple definitions:
  - API Gateway (points to `/api-docs/aggregated`)
  - User Service (`/api-docs/user-service`)
  - Product Service (`/api-docs/product-service`)
  - Order Service (`/api-docs/order-service`)
  - Inventory Service (`/api-docs/inventory-service`)

Aggregation logic is implemented in `api-gateway` (`AggregatedOpenApiController`) and merges `paths` and `components.schemas` from service docs.

## 7. Example Testing Flow

Use gateway base URL: `http://localhost:8086`

1. Register user: `POST /auth/register`
2. Login: `POST /auth/login`
3. Copy JWT token from login response
4. Use token as header: `Authorization: Bearer <token>`
5. Create product: `POST /products`
6. Create/update inventory: `POST /inventory` or `PUT /inventory/{id}`
7. Create order: `POST /orders` (validates user + product + inventory and decrements stock)

## 8. Notes / Observations

1. Ports are consistent across module `application.properties` and startup scripts:
   - gateway `8086`, user `8081`, product `8082`, order `8083`, inventory `8084`.
2. SpringDoc paths are consistently customized to `/swagger-ui.html` and `/api-docs` in all modules (not `/v3/api-docs`).
3. Gateway Swagger is configured to show both aggregated docs and per-service docs in one UI.
4. Gateway route config proxies service docs using rewrite rules (`/api-docs/<service>` -> downstream `/api-docs`).
5. Security behavior differs for direct service access:
   - `user-service` enforces JWT on `/users/**` (except auth/docs paths).
   - `product-service`, `order-service`, and `inventory-service` currently do not define direct Spring Security filters.
6. A code comment in `product-service` references `StripPrefix=1`, but current gateway route properties do not define a `StripPrefix` filter for `/products/**`.
