import type { UserRole } from './authSlice'

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  admin: '/admin',
  manager: '/admin',
  kitchen: '/kitchen',
  cashier: '/cashier',
  waiter: '/waiter',
  barista: '/barista',
  customer: '/customer/dashboard',
}

export function getDashboardRouteForRole(role?: UserRole | null) {
  if (!role) return '/'
  return ROLE_DASHBOARD_ROUTES[role] ?? '/'
}