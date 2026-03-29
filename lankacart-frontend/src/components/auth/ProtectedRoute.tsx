import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface Props { requireAdmin?: boolean }

export default function ProtectedRoute({ requireAdmin = false }: Props) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
