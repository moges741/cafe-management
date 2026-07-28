import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import type { RootState } from '@/app/store'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'

interface ProtectedRouteProps {
  children:     React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isInitializing } = useAppSelector((state: RootState) => state.auth)
  const location = useLocation()
  const { isCustomerMode } = useCurrentBranch()

  // Still checking session — don't decide anything yet
  if (isInitializing) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Logged in but wrong role — send them to their own area instead of blank 403
    return <Navigate to="/" replace />
  }

  // If this route is restricted to operational staff AND the staff member is in customer mode (visiting another branch)
  // block access and send them to the menu as a normal customer.
  if (allowedRoles && !allowedRoles.includes('customer') && isCustomerMode && user?.role !== 'admin' && user?.role !== 'manager') {
    return <Navigate to="/menu" replace />
  }

  return <>{children}</>
}