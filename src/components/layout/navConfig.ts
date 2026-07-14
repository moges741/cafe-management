import {
  LayoutDashboard, Package, ChefHat, Users, BarChart3,
  UtensilsCrossed, Coffee, ClipboardList, Boxes, Store, Tags
} from 'lucide-react'

export interface NavItem {
  label: string
  path:  string
  icon:  typeof LayoutDashboard
}

// Single source of truth: which nav items each role sees.
// Admin sees everything; other roles see only what's relevant to their job.
export const NAV_BY_ROLE: Record<string, NavItem[]> = {
  admin: [
    { label: 'Dashboard',  path: '/admin',            icon: LayoutDashboard },
    { label: 'Analytics',  path: '/admin/analytics',  icon: BarChart3 },
    { label: 'Inventory',  path: '/admin/inventory',  icon: Boxes },
    { label: 'Categories', path: '/admin/categories', icon: Tags },
    { label: 'Products',   path: '/admin/products',   icon: Package },
    { label: 'Orders',     path: '/admin/orders',     icon: ClipboardList },
    { label: 'Staff',      path: '/admin/staff',      icon: Users },
    { label: 'Branches',   path: '/admin/branches',   icon: Store },
  ],
  manager: [
    { label: 'Dashboard',  path: '/admin',            icon: LayoutDashboard },
    { label: 'Analytics',  path: '/admin/analytics',  icon: BarChart3 },
    { label: 'Inventory',  path: '/admin/inventory',  icon: Boxes },
    { label: 'Categories', path: '/admin/categories', icon: Tags },
    { label: 'Orders',     path: '/admin/orders',     icon: ClipboardList },
  ],
  cashier: [
    { label: 'Payments',   path: '/cashier',          icon: ClipboardList },
  ],
  waiter: [
    { label: 'Tables',     path: '/waiter',           icon: UtensilsCrossed },
  ],
  barista: [
    { label: 'Drinks',     path: '/barista',          icon: Coffee },
  ],
  kitchen: [
    { label: 'Kitchen',    path: '/kitchen',          icon: ChefHat },
  ],
}