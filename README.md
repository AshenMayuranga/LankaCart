# LankaCart — Microservices E-Commerce Platform

A full-stack e-commerce platform built with a Java Spring Boot microservices backend and a React TypeScript frontend.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                       │
│                   localhost:5173                         │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP
┌──────────────────────────▼──────────────────────────────┐
│                     API Gateway                          │
│                   localhost:8086                         │
│              (Spring Cloud Gateway)                      │
└───┬───────────┬───────────┬───────────┬─────────────────┘
    │           │           │           │
┌───▼───┐ ┌────▼───┐ ┌─────▼──┐ ┌──────▼──────┐
│ User  │ │Product │ │ Order  │ │  Inventory  │
│ :8081 │ │ :8082  │ │ :8083  │ │    :8084    │
└───┬───┘ └────┬───┘ └─────┬──┘ └──────┬──────┘
    │           │           │           │
┌───▼───────────▼───────────▼───────────▼──────┐
│              PostgreSQL :5432                 │
│  user_db  product_db  order_db  inventory_db  │
└───────────────────────────────────────────────┘
```

---

## Services

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| [api-gateway](./api-gateway/) | 8086 | — | Routes requests, aggregates Swagger docs |
| [user-service](./user-service/) | 8081 | user_service_db | User account management |
| [product-service](./product-service/) | 8082 | product_service_db | Product catalog |
| [order-service](./order-service/) | 8083 | order_service_db | Order processing |
| [inventory-service](./inventory-service/) | 8084 | inventory_service_db | Stock & warehouse tracking |
| [lankacart-frontend](./lankacart-frontend/) | 5173 | — | React TypeScript frontend |

---

## Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.12**
- **Spring Cloud 2023.0.3** (Gateway)
- **Spring Data JPA** + **Hibernate**
- **PostgreSQL**
- **SpringDoc OpenAPI 2.5.0** (Swagger)
- **Lombok**
- **Gradle** (multi-module build)

### Frontend
- **React 18** + **TypeScript**
- **Vite**, **Tailwind CSS**, **React Router v6**
- **TanStack Query v5**, **Zustand**, **Axios**

---

## Prerequisites

- **Java 17+**
- **PostgreSQL 14+** running on port 5432
- **Node.js 18+** and npm
- **Gradle** (wrapper included)

### PostgreSQL Setup

Create the 4 databases before starting services:

```sql
CREATE DATABASE user_service_db;
CREATE DATABASE product_service_db;
CREATE DATABASE order_service_db;
CREATE DATABASE inventory_service_db;
```

Default credentials used by all services: `username=postgres`, `password=postgres`

---

## Running the Project

### Step 1 — Start all backend services

**CMD:**
```cmd
start-all-services.bat
```

**PowerShell:**
```powershell
.\start-all-services.bat
```

**Single Gradle command (one terminal):**
```bash
./gradlew :user-service:bootRun :product-service:bootRun :order-service:bootRun :inventory-service:bootRun :api-gateway:bootRun --parallel
```

Wait ~60 seconds for all services to fully start.

### Step 2 — Start the frontend

```bash
cd lankacart-frontend
npm install
npm run dev
```

### Step 3 — Open in browser

| URL | Description |
|-----|-------------|
| http://localhost:5173 | React frontend |
| http://localhost:8086/swagger-ui.html | Swagger UI (all services) |

---

## API Endpoints

All requests go through the API Gateway at `http://localhost:8086`

| Method | Path | Service | Description |
|--------|------|---------|-------------|
| GET | /users | User | List all users |
| POST | /users | User | Create user |
| GET | /users/{id} | User | Get user |
| PUT | /users/{id} | User | Update user |
| DELETE | /users/{id} | User | Delete user |
| GET | /products | Product | List all products |
| POST | /products | Product | Create product |
| GET | /products/{id} | Product | Get product |
| PUT | /products/{id} | Product | Update product |
| DELETE | /products/{id} | Product | Delete product |
| GET | /orders | Order | List all orders |
| POST | /orders | Order | Create order |
| GET | /orders/{id} | Order | Get order |
| PUT | /orders/{id} | Order | Update order |
| DELETE | /orders/{id} | Order | Delete order |
| GET | /inventory | Inventory | List all inventory |
| POST | /inventory | Inventory | Create inventory item |
| GET | /inventory/{id} | Inventory | Get inventory item |
| PUT | /inventory/{id} | Inventory | Update inventory item |
| DELETE | /inventory/{id} | Inventory | Delete inventory item |

---

## Project Structure

```
LankaCart/
├── api-gateway/              # Spring Cloud Gateway
├── user-service/             # User management microservice
├── product-service/          # Product catalog microservice
├── order-service/            # Order processing microservice
├── inventory-service/        # Inventory management microservice
├── lankacart-frontend/       # React TypeScript frontend
├── build.gradle              # Root Gradle build config
├── settings.gradle           # Module definitions
├── gradle.properties         # Gradle JVM settings
├── start-all-services.bat    # Windows CMD startup script
└── start-all-services.ps1    # PowerShell startup script
```

---

## Default Admin Access

Login to the frontend with:
- **Username:** `admin`
- **Password:** any value

This grants access to the Admin Dashboard at `/admin`.
