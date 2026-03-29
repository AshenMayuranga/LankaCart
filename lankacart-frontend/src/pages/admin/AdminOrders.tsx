import { useState, useMemo } from 'react'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { useOrders, useUpdateOrder, useDeleteOrder } from '@/hooks/useOrders'
import { formatCurrency, formatDateTime, orderStatusColor } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'
import Badge from '@/components/ui/Badge'
import Table, { type Column } from '@/components/ui/Table'

const ALL_STATUSES: (OrderStatus | 'ALL')[] = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const ORDER_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrders() {
  const { data: orders, isLoading } = useOrders()
  const { mutate: updateOrder } = useUpdateOrder()
  const { mutate: deleteOrder } = useDeleteOrder()
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL')

  const filtered = useMemo(() => {
    if (!orders) return []
    if (filterStatus === 'ALL') return orders
    return orders.filter((o) => o.status === filterStatus)
  }, [orders, filterStatus])

  const handleStatusChange = (order: Order, status: OrderStatus) => {
    const { id: _id, orderDate: _date, ...rest } = order
    updateOrder({ id: order.id, body: { ...rest, status } })
  }

  const handleDelete = (id: number) => {
    if (!window.confirm('Delete this order? This cannot be undone.')) return
    deleteOrder(id)
  }

  const columns: Column<Order>[] = [
    {
      key: 'id', header: 'Order',
      render: (o) => <span className="text-xs font-mono text-gray-400">#{o.id}</span>,
      className: 'w-20',
    },
    {
      key: 'userId', header: 'User / Product',
      render: (o) => (
        <div>
          <p className="text-sm font-medium text-gray-900">User #{o.userId}</p>
          <p className="text-xs text-gray-400">Product #{o.productId}</p>
        </div>
      ),
    },
    {
      key: 'quantity', header: 'Qty',
      render: (o) => <span className="text-sm text-gray-700">{o.quantity}</span>,
      className: 'w-16',
    },
    {
      key: 'totalPrice', header: 'Total',
      render: (o) => <span className="font-semibold text-brand-600 text-sm">{formatCurrency(o.totalPrice)}</span>,
    },
    {
      key: 'status', header: 'Status',
      render: (o) => (
        <select
          value={o.status}
          onChange={(e) => handleStatusChange(o, e.target.value as OrderStatus)}
          className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 ${orderStatusColor[o.status]}`}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-white text-gray-900">{s}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'orderDate', header: 'Date',
      render: (o) => <span className="text-xs text-gray-400">{formatDateTime(o.orderDate)}</span>,
    },
    {
      key: 'shippingAddress', header: 'Address',
      render: (o) => (
        <span className="text-xs text-gray-500 truncate max-w-[160px] block">
          {o.shippingAddress ?? '—'}
        </span>
      ),
    },
    {
      key: 'actions', header: '',
      className: 'w-12',
      render: (o) => (
        <button
          onClick={() => handleDelete(o.id)}
          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders?.length ?? 0} total orders</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto mb-5 bg-gray-100 p-1 rounded-xl w-fit max-w-full">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterStatus === s
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            {s !== 'ALL' && (
              <span className="ml-1.5 text-[10px] text-gray-400">
                ({orders?.filter((o) => o.status === s).length ?? 0})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Hint */}
      <p className="text-xs text-gray-400 mb-4">
        Click the status badge to update an order's status inline.
      </p>

      <Table
        columns={columns}
        data={filtered}
        loading={isLoading}
        emptyMessage="No orders found"
        emptyIcon={<ShoppingBag size={40} />}
      />
    </div>
  )
}
