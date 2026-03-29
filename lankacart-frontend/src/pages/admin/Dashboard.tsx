import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, Warehouse, TrendingUp, AlertTriangle } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useOrders } from '@/hooks/useOrders'
import { useUsers } from '@/hooks/useUsers'
import { useInventory } from '@/hooks/useInventory'
import { formatCurrency, formatDateTime, orderStatusColor } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
  trend?: string
}

function StatCard({ title, value, icon: Icon, color, bg, trend }: StatCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && <p className="text-xs text-brand-600 font-medium mt-1">{trend}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { data: products } = useProducts()
  const { data: orders } = useOrders()
  const { data: users } = useUsers()
  const { data: inventory } = useInventory()

  const totalRevenue = orders?.reduce((sum, o) => sum + o.totalPrice, 0) ?? 0
  const lowStockItems = inventory?.filter((i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK') ?? []
  const recentOrders = [...(orders ?? [])].reverse().slice(0, 5)
  const pendingOrders = orders?.filter((o) => o.status === 'PENDING').length ?? 0

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Products"
          value={products?.length ?? '—'}
          icon={Package}
          color="text-brand-600"
          bg="bg-brand-50"
          trend="Active catalog"
        />
        <StatCard
          title="Total Orders"
          value={orders?.length ?? '—'}
          icon={ShoppingBag}
          color="text-blue-600"
          bg="bg-blue-50"
          trend={`${pendingOrders} pending`}
        />
        <StatCard
          title="Total Users"
          value={users?.length ?? '—'}
          icon={Users}
          color="text-purple-600"
          bg="bg-purple-50"
          trend="Registered users"
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          color="text-amber-600"
          bg="bg-amber-50"
          trend="All time"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">No orders yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">#{order.id}</span>
                      <Badge className={orderStatusColor[order.status]}>{order.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      User #{order.userId} · Product #{order.productId} · {formatDateTime(order.orderDate)}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900 shrink-0 text-sm">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory Alerts */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            {lowStockItems.length > 0 && (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
            <h3 className="font-semibold text-gray-900">Stock Alerts</h3>
            {lowStockItems.length > 0 && (
              <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {lowStockItems.length}
              </span>
            )}
          </div>
          {lowStockItems.length === 0 ? (
            <div className="py-12 text-center">
              <Warehouse className="h-8 w-8 text-brand-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">All stock levels are healthy</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {lowStockItems.map((item) => (
                <div key={item.id} className="px-6 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Product #{item.productId}</p>
                    <p className="text-xs text-gray-400">{item.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{item.quantity}</p>
                    <Badge className={item.status === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
