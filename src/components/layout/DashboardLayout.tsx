import { NavLink, Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { useLogoutMutation } from '@/features/auth/authApi'
import { clearUser } from '@/features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { NAV_BY_ROLE } from './navConfig'
import { cn } from '@/lib/utils'

export default function DashboardLayout() {
  const user = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [logout] = useLogoutMutation()

  const navItems = user ? NAV_BY_ROLE[user.role.name] ?? [] : []

  const handleLogout = async () => {
    await logout()
    dispatch(clearUser())
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-border">
          <p className="font-bold text-foreground text-lg">Mr. Cafe</p>
          <p className="text-xs mt-0.5 capitalize" style={{ color: '#B58B67' }}>
            {user?.role.name} panel
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'text-foreground hover:bg-secondary'
              )}
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 w-full"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}