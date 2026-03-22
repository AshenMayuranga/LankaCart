import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

import Home          from '@/pages/Home'
import Products      from '@/pages/Products'
import ProductDetail from '@/pages/ProductDetail'
import Cart          from '@/pages/Cart'
import Checkout      from '@/pages/Checkout'
import Orders        from '@/pages/Orders'
import Login         from '@/pages/Login'
import Register      from '@/pages/Register'
import NotFound      from '@/pages/NotFound'

import Dashboard      from '@/pages/admin/Dashboard'
import AdminProducts  from '@/pages/admin/AdminProducts'
import AdminOrders    from '@/pages/admin/AdminOrders'
import AdminInventory from '@/pages/admin/AdminInventory'
import AdminUsers     from '@/pages/admin/AdminUsers'

export default function App() {
  return (
    <Routes>
      {/* Main store layout */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Auth-protected customer routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Route>

      {/* Admin routes — requires admin role */}
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="admin" element={<Dashboard />} />
          <Route path="admin/products" element={<AdminProducts />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/inventory" element={<AdminInventory />} />
          <Route path="admin/users" element={<AdminUsers />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
