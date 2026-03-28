# Inventory Service

Microservice responsible for tracking product stock levels and warehouse information in the LankaCart platform.

---

## Details

| Property | Value |
|----------|-------|
| Port | **8084** |
| Database | `inventory_service_db` (PostgreSQL) |
| Framework | Spring Boot 3.2.12 |
| DDL Auto | `create-drop` (schema recreated on restart) |

---

## API Endpoints

Base URL: `http://localhost:8084` (direct) or `http://localhost:8086/inventory` (via gateway)

| Method | Path | Description | Request Body |
|--------|------|-------------|-------------|
| GET | `/inventory` | Get all inventory items | — |
| GET | `/inventory/{id}` | Get inventory item by ID | — |
| POST | `/inventory` | Create inventory item | Inventory JSON |
| PUT | `/inventory/{id}` | Update inventory item | Inventory JSON |
| DELETE | `/inventory/{id}` | Delete inventory item | — |

### Inventory JSON Schema

```json
{
  "productId": 3,
  "quantity": 150,
  "location": "Warehouse A - Shelf 3",
  "status": "IN_STOCK",
  "supplier": "Dilmah Exports",
  "warehouseCode": "WH-001"
}
```

### Inventory Status Values

| Status | Description |
|--------|-------------|
| `IN_STOCK` | Sufficient stock available |
| `LOW_STOCK` | Stock running low, reorder needed |
| `OUT_OF_STOCK` | No stock available |

> `lastUpdated` is automatically set on create and update — do not include it in the request body.

### Example Requests

**Add inventory for a product:**
```bash
curl -X POST http://localhost:8086/inventory \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":100,"location":"Warehouse A - Shelf 1","status":"IN_STOCK","supplier":"Local Supplier","warehouseCode":"WH-001"}'
```

**Update stock status:**
```bash
curl -X PUT http://localhost:8086/inventory/1 \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":5,"location":"Warehouse A - Shelf 1","status":"LOW_STOCK","supplier":"Local Supplier","warehouseCode":"WH-001"}'
```

---

## Running

From the project root:

```bash
./gradlew :inventory-service:bootRun
```

---

## Database Setup

Create the database in PostgreSQL before starting:

```sql
CREATE DATABASE inventory_service_db;
```

Connection details (configured in `application.properties`):

| Property | Value |
|----------|-------|
| Host | localhost |
| Port | 5432 |
| Database | inventory_service_db |
| Username | postgres |
| Password | postgres |

---

## Project Structure

```
inventory-service/
└── src/main/
    ├── java/com/lankacart/inventoryservice/
    │   ├── InventoryServiceApplication.java
    │   ├── controller/
    │   │   └── InventoryController.java  # REST endpoints
    │   ├── entity/
    │   │   └── Inventory.java            # JPA entity
    │   └── repository/
    │       └── InventoryRepository.java  # Spring Data JPA
    └── resources/
        └── application.properties
```

---

## Notes

- `productId` references a product in the Product Service — no direct JPA relationship across services
- The Admin Dashboard shows a **Stock Alerts** panel for items with `LOW_STOCK` or `OUT_OF_STOCK` status
- Inventory is not automatically decremented when orders are placed (no inter-service messaging yet)

---

## Swagger UI

```
http://localhost:8084/swagger-ui.html
```
