# Order Service

Microservice responsible for managing customer orders in the LankaCart platform. Handles order creation, status tracking, and shipping information.

---

## Details

| Property | Value |
|----------|-------|
| Port | **8083** |
| Database | `order_service_db` (PostgreSQL) |
| Framework | Spring Boot 3.2.12 |
| DDL Auto | `create-drop` (schema recreated on restart) |

---

## API Endpoints

Base URL: `http://localhost:8083` (direct) or `http://localhost:8086/orders` (via gateway)

| Method | Path | Description | Request Body |
|--------|------|-------------|-------------|
| GET | `/orders` | Get all orders | — |
| GET | `/orders/{id}` | Get order by ID | — |
| POST | `/orders` | Create new order | Order JSON |
| PUT | `/orders/{id}` | Update order | Order JSON |
| DELETE | `/orders/{id}` | Delete order | — |

### Order JSON Schema

```json
{
  "userId": 1,
  "productId": 3,
  "quantity": 2,
  "totalPrice": 1700.00,
  "status": "PENDING",
  "shippingAddress": "No. 42, Galle Road, Colombo 03",
  "shippingDate": null
}
```

### Order Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Order placed, awaiting confirmation |
| `CONFIRMED` | Order confirmed by admin |
| `SHIPPED` | Order dispatched |
| `DELIVERED` | Order delivered to customer |
| `CANCELLED` | Order cancelled |

> `orderDate` is automatically set to the current timestamp when an order is created — do not include it in the request body.

### Example Requests

**Create an order:**
```bash
curl -X POST http://localhost:8086/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"productId":3,"quantity":2,"totalPrice":1700.00,"status":"PENDING","shippingAddress":"No. 42, Galle Road, Colombo 03"}'
```

**Update order status:**
```bash
curl -X PUT http://localhost:8086/orders/1 \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"productId":3,"quantity":2,"totalPrice":1700.00,"status":"CONFIRMED","shippingAddress":"No. 42, Galle Road, Colombo 03"}'
```

---

## Running

From the project root:

```bash
./gradlew :order-service:bootRun
```

---

## Database Setup

Create the database in PostgreSQL before starting:

```sql
CREATE DATABASE order_service_db;
```

Connection details (configured in `application.properties`):

| Property | Value |
|----------|-------|
| Host | localhost |
| Port | 5432 |
| Database | order_service_db |
| Username | postgres |
| Password | postgres |

---

## Project Structure

```
order-service/
└── src/main/
    ├── java/com/lankacart/orderservice/
    │   ├── OrderServiceApplication.java
    │   ├── controller/
    │   │   └── OrderController.java    # REST endpoints
    │   ├── entity/
    │   │   └── Order.java              # JPA entity
    │   └── repository/
    │       └── OrderRepository.java    # Spring Data JPA
    └── resources/
        └── application.properties
```

---

## Notes

- Each order holds a single `productId` — one `Order` record is created per product in a cart
- `userId` and `productId` are stored as plain foreign key values (no JPA join to other services)
- Full order object must be sent on `PUT` requests — partial updates are not supported

---

## Swagger UI

```
http://localhost:8083/swagger-ui.html
```
