# LankaCart Frontend

React + TypeScript frontend for the LankaCart microservices e-commerce platform.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Type safety |
| Vite | 5.4 | Build tool & dev server |
| React Router | 6.26 | Client-side routing |
| TanStack Query | 5.56 | Server state management & caching |
| Zustand | 5.0 | Client state (cart, auth) |
| Axios | 1.7 | HTTP client |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Hook Form | 7.53 | Form handling |
| Zod | 3.23 | Schema validation |
| Lucide React | 0.446 | Icons |
| Sonner | 1.5 | Toast notifications |

---

## Prerequisites

- **Node.js** 18+ and npm
- **Backend services running** (see [../README.md](../README.md) or use `start-all-services.bat`)

Backend must be up on these ports before starting the frontend:

| Service | Port |
|---------|------|
| API Gateway | 8085 |
| User Service | 8081 |
| Product Service | 8082 |
| Order Service | 8083 |
| Inventory Service | 8084 |

---

## Getting Started

```bash
# 1. Navigate to the frontend directory
cd lankacart-frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> All API calls are proxied through Vite's dev server to `http://localhost:8085` (the API Gateway) — no CORS configuration needed.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 5173 |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── api/                  # Axios API functions (one file per service)
│   ├── users.ts
│   ├── products.ts
│   ├── orders.ts
│   └── inventory.ts
│
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx    # Route guard (auth + admin role)
│   ├── cart/
│   │   ├── CartDrawer.tsx        # Slide-in cart panel
│   │   └── CartItem.tsx          # Individual cart row
│   ├── layout/
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   ├── Footer.tsx            # Site footer
│   │   ├── MainLayout.tsx        # Public page wrapper
│   │   ├── AdminLayout.tsx       # Admin page wrapper
│   │   └── AdminSidebar.tsx      # Admin left sidebar
│   ├── products/
│   │   ├── ProductCard.tsx       # Product grid card
│   │   └── ProductFilters.tsx    # Search + price filter bar
│   └── ui/                       # Reusable base components
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── EmptyState.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       ├── Spinner.tsx
│       ├── Table.tsx
│       └── Textarea.tsx
│
├── hooks/                # TanStack Query hooks (CRUD per service)
│   ├── useProducts.ts
│   ├── useUsers.ts
│   ├── useOrders.ts
│   └── useInventory.ts
│
├── lib/
│   ├── axios.ts          # Axios instance with interceptors
│   ├── queryClient.ts    # TanStack Query client config
│   └── utils.ts          # Formatters, color maps, cn() helper
│
├── pages/
│   ├── Home.tsx          # Landing page (hero, categories, featured)
│   ├── Products.tsx      # Product catalog with search/filter
│   ├── ProductDetail.tsx # Single product page
│   ├── Cart.tsx          # Cart page
│   ├── Checkout.tsx      # Checkout form → creates orders
│   ├── Orders.tsx        # My orders (customer)
│   ├── Login.tsx         # Sign in
│   ├── Register.tsx      # Create account
│   ├── NotFound.tsx      # 404 page
│   └── admin/
│       ├── Dashboard.tsx       # Stats, recent orders, stock alerts
│       ├── AdminProducts.tsx   # Products CRUD
│       ├── AdminOrders.tsx     # Orders management + status update
│       ├── AdminInventory.tsx  # Inventory CRUD
│       └── AdminUsers.tsx      # Users CRUD
│
├── store/
│   ├── authStore.ts      # Zustand auth store (mock, localStorage)
│   └── cartStore.ts      # Zustand cart store (persisted)
│
├── types/
│   └── index.ts          # TypeScript interfaces matching Java entities
│
├── App.tsx               # Route definitions
├── main.tsx              # App entry point
└── index.css             # Tailwind base + custom component classes
```

---

## Pages & Routes

### Public (no login required)

| Route | Page |
|-------|------|
| `/` | Home — hero section, categories, featured products |
| `/products` | Product catalog with search and price filter |
| `/products/:id` | Product detail with add-to-cart and buy now |
| `/cart` | Shopping cart |
| `/login` | Sign in |
| `/register` | Create account |

### Protected (login required)

| Route | Page |
|-------|------|
| `/checkout` | Checkout form — places orders via API |
| `/orders` | Customer's order history with status tracking |

### Admin (login as `admin` required)

| Route | Page |
|-------|------|
| `/admin` | Dashboard with KPIs, recent orders, stock alerts |
| `/admin/products` | Products management (create, edit, delete) |
| `/admin/orders` | Orders management (inline status updates, delete) |
| `/admin/inventory` | Inventory management (create, edit, delete) |
| `/admin/users` | Users management (create, edit, delete) |

---

## Authentication

Authentication is **mocked client-side** — the backend does not have an auth endpoint yet.

- Any username / password combination works
- Logging in as `admin` grants admin role and access to `/admin/*`
- Session is persisted in `localStorage` and survives page refresh
- Token (`localStorage.lankacart_token`) is automatically attached to every API request as a `Bearer` token header

> When a real auth endpoint is added to the backend, update `src/store/authStore.ts` to call it instead of the mock logic.

---

## API Integration

All API calls go through the Vite dev proxy → API Gateway → microservice.

```
Browser → :5173/products/** → Vite proxy → :8085/products/** → Product Service :8082
```

The proxy is configured in [vite.config.ts](vite.config.ts):

```ts
proxy: {
  '/users':     { target: 'http://localhost:8085', changeOrigin: true },
  '/products':  { target: 'http://localhost:8085', changeOrigin: true },
  '/orders':    { target: 'http://localhost:8085', changeOrigin: true },
  '/inventory': { target: 'http://localhost:8085', changeOrigin: true },
}
```

### Service endpoints used

| Hook file | Endpoints |
|-----------|-----------|
| `useProducts.ts` | `GET/POST /products`, `PUT/DELETE /products/:id` |
| `useUsers.ts` | `GET/POST /users`, `PUT/DELETE /users/:id` |
| `useOrders.ts` | `GET/POST /orders`, `PUT/DELETE /orders/:id` |
| `useInventory.ts` | `GET/POST /inventory`, `PUT/DELETE /inventory/:id` |

---

## State Management

### Server State — TanStack Query
All API data is managed by TanStack Query with a **2-minute stale time**. Each service has a dedicated hooks file with `useQuery` and `useMutation` wrappers. Mutations automatically invalidate the relevant query cache on success.

### Client State — Zustand

| Store | Persisted | Description |
|-------|-----------|-------------|
| `cartStore` | Yes (`lankacart_cart`) | Cart items, quantity management, drawer open/close |
| `authStore` | Yes (`lankacart_user`) | Current user, login/logout |

---

## Notes

### Spring Boot `LocalDateTime` serialisation
Spring Boot may serialise `LocalDateTime` as a JSON array (`[2025,3,22,14,30,0]`) if `write-dates-as-timestamps` is not disabled. The `parseDate()` utility in `src/lib/utils.ts` handles both array and ISO string formats transparently.

### One order per cart item
The backend `Order` entity holds a single `productId`. At checkout, one `Order` record is created per cart item. This matches the existing schema.

### BigDecimal prices
Java `BigDecimal` fields (`price`, `totalPrice`) serialise as plain JSON numbers. They are typed as `number` in TypeScript.

---

## Production Build

```bash
npm run build
```

Output goes to `dist/`. To serve it, configure your web server to proxy API paths (`/users`, `/products`, `/orders`, `/inventory`) to the API Gateway at port 8085, and serve `index.html` for all other routes (SPA fallback).
