# User Service

Microservice responsible for managing user accounts in the LankaCart platform. Provides full CRUD operations for user data.

---

## Details

| Property | Value |
|----------|-------|
| Port | **8081** |
| Database | `user_service_db` (PostgreSQL) |
| Framework | Spring Boot 3.2.12 |
| DDL Auto | `create-drop` (schema recreated on restart) |

---

## API Endpoints

Base URL: `http://localhost:8081` (direct) or `http://localhost:8086/users` (via gateway)

| Method | Path | Description | Request Body |
|--------|------|-------------|-------------|
| GET | `/users` | Get all users | — |
| GET | `/users/{id}` | Get user by ID | — |
| POST | `/users` | Create new user | User JSON |
| PUT | `/users/{id}` | Update user | User JSON |
| DELETE | `/users/{id}` | Delete user | — |

### User JSON Schema

```json
{
  "username": "kasun_perera",
  "email": "kasun@example.com",
  "firstName": "Kasun",
  "lastName": "Perera",
  "password": "secret123",
  "phoneNumber": "+94712345678"
}
```

### Example Requests

**Create a user:**
```bash
curl -X POST http://localhost:8086/users \
  -H "Content-Type: application/json" \
  -d '{"username":"kasun","email":"kasun@example.com","firstName":"Kasun","lastName":"Perera","password":"pass123"}'
```

**Get all users:**
```bash
curl http://localhost:8086/users
```

---

## Running

From the project root:

```bash
./gradlew :user-service:bootRun
```

---

## Database Setup

Create the database in PostgreSQL before starting:

```sql
CREATE DATABASE user_service_db;
```

Connection details (configured in `application.properties`):

| Property | Value |
|----------|-------|
| Host | localhost |
| Port | 5432 |
| Database | user_service_db |
| Username | postgres |
| Password | postgres |

---

## Project Structure

```
user-service/
└── src/main/
    ├── java/com/lankacart/userservice/
    │   ├── UserServiceApplication.java
    │   ├── controller/
    │   │   └── UserController.java     # REST endpoints
    │   ├── entity/
    │   │   └── User.java               # JPA entity
    │   └── repository/
    │       └── UserRepository.java     # Spring Data JPA
    └── resources/
        └── application.properties
```

---

## Swagger UI

```
http://localhost:8081/swagger-ui.html
```
