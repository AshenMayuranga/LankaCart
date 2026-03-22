# Product Service

Microservice responsible for managing the product catalog in the LankaCart platform. Provides full CRUD operations for products with input validation.

---

## Details

| Property | Value |
|----------|-------|
| Port | **8082** |
| Database | `product_service_db` (PostgreSQL) |
| Framework | Spring Boot 3.2.12 |
| DDL Auto | `update` (schema preserved across restarts) |

---

## API Endpoints

Base URL: `http://localhost:8082` (direct) or `http://localhost:8086/products` (via gateway)

| Method | Path | Description | Request Body |
|--------|------|-------------|-------------|
| GET | `/products` | Get all products | — |
| GET | `/products/{id}` | Get product by ID | — |
| POST | `/products` | Create new product | Product JSON |
| PUT | `/products/{id}` | Update product | Product JSON |
| DELETE | `/products/{id}` | Delete product | — |

### Product JSON Schema

```json
{
  "name": "Ceylon Black Tea 250g",
  "price": 850.00,
  "description": "Premium quality Ceylon black tea"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| name | String | Yes | Not blank |
| price | BigDecimal | Yes | Must be ≥ 0 |
| description | String | No | — |

### Example Requests

**Create a product:**
```bash
curl -X POST http://localhost:8086/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Ceylon Black Tea 250g","price":850.00,"description":"Premium quality Ceylon black tea"}'
```

**Get all products:**
```bash
curl http://localhost:8086/products
```

**Update a product:**
```bash
curl -X PUT http://localhost:8086/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Ceylon Black Tea 500g","price":1500.00}'
```

---

## Running

From the project root:

```bash
./gradlew :product-service:bootRun
```

---

## Database Setup

Create the database in PostgreSQL before starting:

```sql
CREATE DATABASE product_service_db;
```

Connection details (configured in `application.properties`):

| Property | Value |
|----------|-------|
| Host | localhost |
| Port | 5432 |
| Database | product_service_db |
| Username | postgres |
| Password | postgres |

---

## Project Structure

```
product-service/
└── src/main/
    ├── java/com/lankacart/productservice/
    │   ├── ProductServiceApplication.java
    │   ├── controller/
    │   │   └── ProductController.java  # REST endpoints
    │   ├── domain/
    │   │   └── Product.java            # JPA entity
    │   └── repository/
    │       └── ProductRepository.java  # Spring Data JPA
    └── resources/
        └── application.properties
```

---

## Swagger UI

```
http://localhost:8082/swagger-ui.html
```
