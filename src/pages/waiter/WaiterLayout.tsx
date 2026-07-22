import { Link, Outlet, useLocation } from 'react-router-dom'
import { ClipboardList, History, PlusSquare, ConciergeBell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function WaiterLayout() {
  const location = useLocation()

  const tabs = [
    { name: 'Incoming Orders', path: '/waiter', end: true, icon: ClipboardList },
    { name: 'Archive', path: '/waiter/history', end: false, icon: History },
    { name: 'New Ticket', path: '/waiter/new', end: false, icon: PlusSquare },
  ]

  return (
    <div className="mt-16 md:mt-20 h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)] bg-[#050505] flex flex-col font-sans text-white">
      
      {/* Premium Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a] px-4 py-3 md:px-6 md:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <ConciergeBell className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight uppercase leading-none">
              Service Desk
            </h1>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
              Floor Operations
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1 bg-white/[0.02] border border-white/5 p-1.5 rounded-xl w-full sm:w-auto shadow-inner">
          {tabs.map((tab) => {
            const isActive = tab.end
              ? location.pathname === tab.path
              : location.pathname.startsWith(tab.path)
            
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  'relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 md:px-5 md:py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors z-10',
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="waiter-tab-indicator"
                    className="absolute inset-0 bg-blue-600 rounded-lg -z-10 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <tab.icon 
                  size={16} 
                  className={cn(
                    "w-4 h-4 md:w-4 md:h-4 shrink-0 transition-colors", 
                    isActive ? 'text-white' : 'text-neutral-500'
                  )} 
                />
                <span className="truncate">{tab.name}</span>
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] sm:w-[800px] h-[300px] bg-blue-500/5 blur-[100px] pointer-events-none -z-10" />
        <Outlet />
      </main>
    </div>
  )
}