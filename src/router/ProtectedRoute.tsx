import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

interface ProtectedRouteProps {
  children:     React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isInitializing } = useAppSelector(state => state.auth)

  // Still checking session — don't decide anything yet
  if (isInitializing) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role.name)) {
    // Logged in but wrong role — send them to their own area instead of blank 403
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}