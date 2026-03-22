import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import CartItem from '@/components/cart/CartItem'
import EmptyState from '@/components/ui/EmptyState'

export default function Cart() {
  const { items, clearCart, totalPrice, totalItems } = useCartStore()
  const navigate = useNavigate()
  const count = totalItems()
  const total = totalPrice()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        {count > 0 && (
          <span className="text-sm text-gray-400">({count} item{count !== 1 ? 's' : ''})</span>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart size={56} />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Start shopping to fill it up!"
          action={
            <Link to="/products" className="btn-primary gap-2">
              Browse Products <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="card p-0 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <span className="text-sm font-semibold text-gray-700">Items</span>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear all
                </button>
              </div>
              <div className="px-6 divide-y divide-gray-50">
                {items.map((item) => <CartItem key={item.product.id} item={item} />)}
              </div>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-brand-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate max-w-[160px]">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900 shrink-0 ml-2">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="text-brand-600 font-medium">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 mb-6 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-xl text-brand-600">{formatCurrency(total)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full py-3 text-base justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
