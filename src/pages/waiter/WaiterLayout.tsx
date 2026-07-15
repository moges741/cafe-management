import { Link, Outlet, useLocation } from 'react-router-dom'
import { ClipboardList, History, PlusSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function WaiterLayout() {
  const location = useLocation()

  const tabs = [
    { name: 'Incoming Orders', path: '/waiter', end: true, icon: ClipboardList },
    { name: 'History', path: '/waiter/history', end: false, icon: History },
    { name: 'New Order', path: '/waiter/new', end: false, icon: PlusSquare },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Waiter Dashboard</h1>
        <nav className="flex items-center gap-1 bg-secondary p-1 rounded-lg">
          {tabs.map((tab) => {
            const isActive = tab.end
              ? location.pathname === tab.path
              : location.pathname.startsWith(tab.path)
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                <tab.icon size={16} />
                {tab.name}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
