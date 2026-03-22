import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency, formatDateTime, orderStatusColor } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { Link } from 'react-router-dom'
import type { OrderStatus } from '@/types'

const statuses: (OrderStatus | 'ALL')[] = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function Orders() {
  const { user } = useAuthStore()
  const { data: allOrders, isLoading, isError } = useOrders()
  const [activeStatus, setActiveStatus] = useState<OrderStatus | 'ALL'>('ALL')

  // Filter by current user (client-side)
  const myOrders = allOrders?.filter((o) => o.userId === user?.id) ?? []
  const filtered = activeStatus === 'ALL' ? myOrders : myOrders.filter((o) => o.status === activeStatus)

  if (isLoading) return <Spinner label="Loading your orders..." />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{myOrders.length} total order{myOrders.length !== 1 ? 's' : ''}</p>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600 mb-6">
          Failed to load orders. Make sure backend services are running.
        </div>
      )}

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto mb-6 bg-gray-100 p-1 rounded-xl w-fit max-w-full">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeStatus === s
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            {s !== 'ALL' && (
              <span className="ml-1.5 text-[10px] text-gray-400">
                ({myOrders.filter((o) => o.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={56} />}
          title={activeStatus === 'ALL' ? "You haven't placed any orders yet" : `No ${activeStatus.toLowerCase()} orders`}
          description="Shop our collection and your orders will appear here."
          action={
            <Link to="/products" className="btn-primary">Start Shopping</Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-xs font-mono text-gray-400">#{order.id}</span>
                    <Badge className={orderStatusColor[order.status]}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Placed on {formatDateTime(order.orderDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-brand-600">{formatCurrency(order.totalPrice)}</p>
                  <p className="text-xs text-gray-400">{order.quantity} item{order.quantity !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Product ID</p>
                  <p className="text-sm font-medium text-gray-700">#{order.productId}</p>
                </div>
                {order.shippingAddress && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-400 mb-0.5">Ship to</p>
                    <p className="text-sm font-medium text-gray-700 truncate">{order.shippingAddress}</p>
                  </div>
                )}
              </div>

              {/* Status timeline */}
              <div className="mt-4 flex items-center gap-1">
                {(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'] as OrderStatus[]).map((s, i) => {
                  const statuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']
                  const currentIdx = statuses.indexOf(order.status)
                  const isActive = i <= currentIdx && order.status !== 'CANCELLED'
                  const isCancelled = order.status === 'CANCELLED'
                  return (
                    <div key={s} className="flex items-center flex-1">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        isCancelled ? 'bg-red-200' : isActive ? 'bg-brand-500' : 'bg-gray-200'
                      }`} />
                      {i < 3 && (
                        <div className={`h-0.5 flex-1 mx-0.5 ${
                          isCancelled ? 'bg-red-100' : isActive && i < currentIdx ? 'bg-brand-400' : 'bg-gray-100'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-1">
                {(['Pending', 'Confirmed', 'Shipped', 'Delivered']).map((label) => (
                  <span key={label} className="text-[9px] text-gray-400">{label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
