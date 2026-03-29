// ─── Domain types matching Java entities ───────────────────────────────────

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  password?: string
  phoneNumber?: string
  role?: 'ADMIN' | 'CUSTOMER'
}

export type UserCreate = Omit<User, 'id'>
export type UserUpdate = Partial<UserCreate>

export interface Product {
  id: number
  name: string
  price: number
  description?: string
}

export type ProductCreate = Omit<Product, 'id'>
export type ProductUpdate = Partial<ProductCreate>

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export interface Order {
  id: number
  userId: number
  productId: number
  quantity: number
  totalPrice: number
  status: OrderStatus
  orderDate: string | number[]
  shippingDate?: string | number[]
  shippingAddress?: string
}

export type OrderCreate = Omit<Order, 'id' | 'orderDate'>
export type OrderUpdate = Partial<Omit<Order, 'id' | 'orderDate'>>

export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

export interface Inventory {
  id: number
  productId: number
  quantity: number
  location: string
  status: InventoryStatus
  lastUpdated: string | number[]
  supplier?: string
  warehouseCode?: string
}

export type InventoryCreate = Omit<Inventory, 'id' | 'lastUpdated'>
export type InventoryUpdate = Partial<InventoryCreate>

// ─── Cart (client-side only) ───────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
}

// ─── Auth ─────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'CUSTOMER'
}

export interface AuthResponse {
  token: string
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'CUSTOMER'
}
