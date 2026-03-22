import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag, Warehouse, Users, ArrowLeft, Package2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { to: '/admin/users', label: 'Users', icon: Users },
]

export default function AdminSidebar() {
  const { user } = useAuthStore()

  return (
    <aside className="w-64 min-h-screen bg-brand-900 text-white flex flex-col shrink-0">
      {/* Header */}
      <div className="px-6 py-5 border-b border-brand-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Package2 className="h-4.5 w-4.5 text-white" size={18} />
          </div>
          <div>
            <p className="font-bold text-sm">LankaCart</p>
            <p className="text-xs text-brand-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-brand-700">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-brand-800">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
            <span className="text-sm font-bold">{user?.firstName?.[0]?.toUpperCase() ?? 'A'}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-brand-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-brand-300 hover:text-white hover:bg-brand-700'
              )
            }
          >
            <Icon className="h-4.5 w-4.5 shrink-0" size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Back to store */}
      <div className="px-3 py-4 border-t border-brand-700">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-300 hover:text-white hover:bg-brand-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>
      </div>
    </aside>
  )
}
