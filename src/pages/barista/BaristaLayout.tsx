import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Coffee, ListCheck, Package, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BaristaLayout() {
  const location = useLocation()
  
  const navItems = [
    { to: '/barista', icon: Coffee, label: 'Live Queue', exact: true },
    { to: '/barista/history', icon: Clock, label: 'History', exact: false },
    { to: '/barista/inventory', icon: Package, label: 'Inventory', exact: false },
    { to: '/barista/menu-status', icon: ListCheck, label: 'Menu Status', exact: false },
  ]

  return (
    <div className="flex h-[100dvh] bg-[#050505] overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-16 md:w-20 lg:w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col pt-6 shrink-0 z-10 shadow-2xl transition-all duration-300">
        
        <div className="px-4 lg:px-6 mb-8 flex items-center justify-center lg:justify-start">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Coffee className="w-5 h-5 text-amber-500" />
          </div>
          <span className="hidden lg:block ml-3 font-black text-xl tracking-tight text-white uppercase">
            Barista
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-2 px-3 lg:px-4">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.to 
              : location.pathname.startsWith(item.to)
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                    : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5 border border-transparent"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 rounded-r-full shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                )}
                <Icon size={20} className={cn(
                  "shrink-0 transition-transform duration-300", 
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="hidden lg:block text-sm font-bold tracking-widest uppercase">
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
