# LankaCart Swagger API Testing Guide

This guide is based on the current LankaCart codebase (gateway routes, controllers, Spring Security, and SpringDoc config).

## 1. Project Testing Overview

### Start services

From project root:

```powershell
.\start-all-services.bat
```

Or start modules manually:

```bash
./gradlew :user-service:bootRun :product-service:bootRun :order-service:bootRun :inventory-service:bootRun :api-gateway:bootRun --parallel
```

### Ports and services

| Service | Port | Base URL |
|---|---:|---|
| API Gateway | 8086 | `http://localhost:8086` |
| User Service | 8081 | `http://localhost:8081` |
| Product Service | 8082 | `http://localhost:8082` |
| Order Service | 8083 | `http://localhost:8083` |
| Inventory Service | 8084 | `http://localhost:8084` |

### Testing via gateway vs direct service

- Recommended: test business flow through the gateway (`http://localhost:8086`) to validate routing and gateway JWT protection.
- Direct service Swagger is useful for service-level debugging.
- Direct access behavior differs by service (see Limitations section).

## 2. Swagger / OpenAPI URLs

### Gateway

- Gateway Swagger UI: `http://localhost:8086/swagger-ui.html`
- Gateway OpenAPI JSON: `http://localhost:8086/api-docs`
- Aggregated OpenAPI JSON: `http://localhost:8086/api-docs/aggregated`

### Gateway proxied service docs

- User service docs via gateway: `http://localhost:8086/api-docs/user-service`
- Product service docs via gateway: `http://localhost:8086/api-docs/product-service`
- Order service docs via gateway: `http://localhost:8086/api-docs/order-service`
- Inventory service docs via gateway: `http://localhost:8086/api-docs/inventory-service`

### Direct service Swagger

- User service Swagger UI: `http://localhost:8081/swagger-ui.html`
- User service OpenAPI JSON: `http://localhost:8081/api-docs`
- Product service Swagger UI: `http://localhost:8082/swagger-ui.html`
- Product service OpenAPI JSON: `http://localhost:8082/api-docs`
- Order service Swagger UI: `http://localhost:8083/swagger-ui.html`
- Order service OpenAPI JSON: `http://localhost:8083/api-docs`
- Inventory service Swagger UI: `http://localhost:8084/swagger-ui.html`
- Inventory service OpenAPI JSON: `http://localhost:8084/api-docs`

## 3. Authentication Testing Steps

### Step A: Register

`POST /auth/register`

```json
{
  "username": "demo_user",
  "email": "demo@example.com",
  "firstName": "Demo",
  "lastName": "User",
  "password": "secret123",
  "phoneNumber": "+94770000000"
}
```

Expected success: `200 OK` with `token` and user data.

### Step B: Login

`POST /auth/login`

```json
{
  "username": "demo_user",
  "password": "secret123"
}
```

Expected success: `200 OK` with `token`.

### Step C: Use JWT token

- Required format in header:

```text
Authorization: Bearer <JWT_TOKEN>
```

- Gateway and user-service both validate Bearer tokens.
- If Swagger UI shows an **Authorize** button:
  - Click **Authorize**.
  - Paste `Bearer <JWT_TOKEN>`.
  - Click **Authorize** then **Close**.
- If Authorize is not shown, see Limitations section (OpenAPI security scheme is not defined in code).

### Public endpoints (through gateway)

- `POST /auth/register`
- `POST /auth/login`
- `GET /products`
- `GET /products/{id}`
- `GET /gateway/health`
- `GET /gateway/routes`
- `GET /gateway/info`
- `/api-docs/**` and `/swagger-ui/**`

### Protected endpoints (through gateway)

- All `/users/**`
- Product write: `POST/PUT/DELETE /products/**`
- All `/orders/**`
- All `/inventory/**`

## 4. Endpoint-by-Endpoint Testing Guide

## Gateway Endpoints

| Method | Path | Purpose | Auth | Success |
|---|---|---|---|---|
| GET | `/gateway/health` | Gateway health info | No | `200 OK` |
| GET | `/gateway/routes` | Current route list | No | `200 OK` |
| GET | `/gateway/info` | Gateway and service info | No | `200 OK` |
| GET | `/api-docs/aggregated` | Aggregated OpenAPI doc | No | `200 OK` |

Notes:

- `/gateway/**` is explicitly public in gateway JWT filter.

## Auth Endpoints (`user-service`)

| Method | Path | Purpose | Auth | Success |
|---|---|---|---|---|
| POST | `/auth/register` | Register new user and issue token | No | `200 OK` |
| POST | `/auth/login` | Login and issue token | No | `200 OK` |

Request example for `/auth/register`:

```json
{
  "username": "demo_user",
  "email": "demo@example.com",
  "firstName": "Demo",
  "lastName": "User",
  "password": "secret123",
  "phoneNumber": "+94770000000"
}
```

Request example for `/auth/login`:

```json
{
  "username": "demo_user",
  "password": "secret123"
}
```

Expected response body (both endpoints):

```json
{
  "token": "<jwt-token>",
  "id": 1,
  "username": "demo_user",
  "email": "demo@example.com",
  "firstName": "Demo",
  "lastName": "User",
  "role": "CUSTOMER"
}
```

## User Endpoints (`user-service`)

| Method | Path | Purpose | Auth via Gateway | Success |
|---|---|---|---|---|
| GET | `/users` | List users | Yes | `200 OK` |
| GET | `/users/{id}` | Get user by ID | Yes | `200 OK` |
| POST | `/users` | Create user | Yes | `201 Created` |
| PUT | `/users/{id}` | Update user | Yes | `200 OK` |
| DELETE | `/users/{id}` | Delete user | Yes | `204 No Content` |

Sample path variable:

- `/users/1`

`POST /users` request body:

```json
{
  "username": "second_user",
  "email": "second@example.com",
  "firstName": "Second",
  "lastName": "User",
  "password": "secret123",
  "phoneNumber": "+94771111111"
}
```

`PUT /users/{id}` request body:

```json
{
  "username": "demo_user",
  "email": "demo.updated@example.com",
  "firstName": "Demo",
  "lastName": "User",
  "password": "newSecret123",
  "phoneNumber": "+94772222222"
}
```

Important notes:

- `password` is write-only (`@JsonProperty(WRITE_ONLY)`), so responses do not include it.
- Missing user returns `404`.

## Product Endpoints (`product-service`)

| Method | Path | Purpose | Auth via Gateway | Success |
|---|---|---|---|---|
| GET | `/products` | List products | No | `200 OK` |
| GET | `/products/{id}` | Get product by ID | No | `200 OK` |
| POST | `/products` | Create product | Yes | `201 Created` |
| PUT | `/products/{id}` | Update product | Yes | `200 OK` |
| DELETE | `/products/{id}` | Delete product | Yes | `204 No Content` |

Sample path variable:

- `/products/1`

`POST /products` request body:

```json
{
  "name": "Tea Pack",
  "price": 1200.00,
  "description": "Premium tea pack"
}
```

`PUT /products/{id}` request body:

```json
{
  "name": "Tea Pack XL",
  "price": 1500.00,
  "description": "Updated product"
}
```

Important notes:

- Validation: `name` required, `price >= 0`.
- Missing product returns `404`.

## Order Endpoints (`order-service`)

| Method | Path | Purpose | Auth via Gateway | Success |
|---|---|---|---|---|
| GET | `/orders` | List orders | Yes | `200 OK` |
| GET | `/orders/{id}` | Get order by ID | Yes | `200 OK` |
| POST | `/orders` | Create order with business validations | Yes | `201 Created` |
| PUT | `/orders/{id}` | Update order | Yes | `200 OK` |
| DELETE | `/orders/{id}` | Delete order | Yes | `204 No Content` |

Sample path variable:

- `/orders/1`

`POST /orders` request body:

```json
{
  "userId": 1,
  "productId": 1,
  "quantity": 2,
  "totalPrice": 2400.00,
  "status": "PLACED",
  "shippingAddress": "Colombo"
}
```

`PUT /orders/{id}` request body:

```json
{
  "userId": 1,
  "productId": 1,
  "quantity": 2,
  "totalPrice": 2400.00,
  "status": "SHIPPED",
  "shippingDate": "2026-04-02T10:30:00",
  "shippingAddress": "Colombo"
}
```

Important notes:

- Create-order business checks:
  - User must exist
  - Product must exist
  - Inventory must exist and be sufficient
  - Stock is decremented on success
- Common create failures:
  - `400` invalid user/product/inventory/stock
  - `401` missing or invalid Bearer token
  - `403` forbidden from downstream validation
  - `502` downstream validation call failure

## Inventory Endpoints (`inventory-service`)

| Method | Path | Purpose | Auth via Gateway | Success |
|---|---|---|---|---|
| GET | `/inventory` | List inventory records | Yes | `200 OK` |
| GET | `/inventory/{id}` | Get inventory by ID | Yes | `200 OK` |
| GET | `/inventory/product/{productId}` | Get inventory by product ID | Yes | `200 OK` |
| POST | `/inventory` | Create inventory record | Yes | `201 Created` |
| PUT | `/inventory/{id}` | Update inventory record | Yes | `200 OK` |
| POST | `/inventory/product/{productId}/decrement?quantity=n` | Reduce stock | Yes | `200 OK` |
| POST | `/inventory/product/{productId}/increment?quantity=n` | Increase stock | Yes | `200 OK` |
| DELETE | `/inventory/{id}` | Delete inventory record | Yes | `204 No Content` |

Sample path variables:

- `/inventory/1`
- `/inventory/product/1`

`POST /inventory` request body:

```json
{
  "productId": 1,
  "quantity": 20,
  "location": "Warehouse A",
  "status": "IN_STOCK",
  "supplier": "Local Supplier",
  "warehouseCode": "WH-01"
}
```

`PUT /inventory/{id}` request body:

```json
{
  "productId": 1,
  "quantity": 15,
  "location": "Warehouse A",
  "status": "LOW_STOCK",
  "supplier": "Local Supplier",
  "warehouseCode": "WH-01"
}
```

Important notes:

- `lastUpdated` is server-managed on create/update/stock operations.
- `quantity` query parameter for increment/decrement must be `> 0`.
- Decrement returns `400` when stock is insufficient.

## 5. Practical Testing Sequence

1. Start all services.
2. Open gateway Swagger: `http://localhost:8086/swagger-ui.html`.
3. Test `POST /auth/register`.
4. Test `POST /auth/login`.
5. Copy JWT token.
6. Test gateway public endpoints:
   - `GET /products`
   - `GET /gateway/health`
7. Test protected endpoints with token:
   - `POST /products`
   - `POST /inventory`
   - `POST /orders`
8. Verify read flows:
   - `GET /orders/{id}`
   - `GET /inventory/product/{productId}` (check stock reduced)
9. Verify update/delete flows:
   - `PUT /products/{id}`, `DELETE /products/{id}`
   - `PUT /orders/{id}`, `DELETE /orders/{id}`
   - `PUT /inventory/{id}`, `DELETE /inventory/{id}`
   - `PUT /users/{id}`, `DELETE /users/{id}`

## 6. Notes About Current Limitations

1. OpenAPI security scheme is not explicitly defined in code (`@SecurityScheme` is missing), so Swagger UI may not show a global Bearer Authorize button.
2. Gateway enforces JWT on protected routes, but direct access security differs:
   - `user-service` direct `/users/**` is protected.
   - `product-service`, `order-service`, and `inventory-service` have no Spring Security config for direct calls.
3. `POST /orders` always requires `Authorization: Bearer ...` because order business logic validates the header before processing.
4. Product controller contains a comment mentioning `StripPrefix=1`, but current gateway route config for `/products/**` does not define `StripPrefix`.
5. Cross-service relations are by IDs (`userId`, `productId`) with runtime validation, not DB foreign keys across services.
