import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { X, ShoppingCart, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import CartItem from './CartItem'

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, clearCart, totalPrice, totalItems } = useCartStore()
  const navigate = useNavigate()
  const count = totalItems()
  const total = totalPrice()

  const handleCheckout = () => {
    closeDrawer()
    navigate('/checkout')
  }

  if (!isDrawerOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={closeDrawer}
      />
      {/* Drawer panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col drawer-enter">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-brand-600" />
            <h2 className="font-semibold text-gray-900">Cart</h2>
            {count > 0 && (
              <span className="text-xs font-medium bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Clear cart"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 divide-y divide-gray-50">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-gray-300" />
              </div>
              <p className="font-medium text-gray-900 text-sm">Your cart is empty</p>
              <p className="text-xs text-gray-400">Add some products to get started</p>
              <Link
                to="/products"
                onClick={closeDrawer}
                className="btn-primary text-xs py-2 px-4 mt-1"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.product.id} item={item} />)
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal ({count} item{count !== 1 ? 's' : ''})</span>
              <span className="font-bold text-gray-900">{formatCurrency(total)}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="btn-secondary text-sm py-2.5 text-center"
              >
                View Cart
              </Link>
              <button onClick={handleCheckout} className="btn-primary text-sm py-2.5">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
