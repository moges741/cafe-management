import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X, Coffee } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { useLogoutMutation } from '@/features/auth/authApi'
import { clearUser } from '@/features/auth/authSlice'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import { NAV_BY_ROLE } from './navConfig'
import { cn } from '@/lib/utils'
import BranchSelector from '@/components/shared/BranchSelector'
import PwaNetworkBanner from '@/components/shared/PwaNetworkBanner'

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  const user = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [logout] = useLogoutMutation()
  useCurrentBranch()

  const navItems = user ? NAV_BY_ROLE[user.role] ?? [] : []

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isSidebarOpen])

  const handleLogout = async () => {
    await logout()
    dispatch(clearUser())
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Coffee size={20} />
          </div>
          <div>
            <p className="font-bold text-white tracking-wide text-lg">Mr. Cafe</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mt-0.5">
              {user?.role} Panel
            </p>
          </div>
        </div>

        {/* Branch Selector */}
        <div className="mt-5">
    <BranchSelector variant="compact" />

        
        </div>

      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-none">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) => cn(
              'flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300',
              isActive
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                : 'text-neutral-400 border border-transparent hover:text-white hover:bg-white/[0.03] hover:border-white/5'
            )}
          >
            <item.icon size={18} className={cn("transition-colors", ({ isActive }: any) => isActive ? "text-amber-500" : "text-neutral-500")} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-300 w-full group"
        >
          <LogOut size={18} className="text-red-500 group-hover:text-red-400 transition-colors" />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <section className="bg-[#050301] min-h-screen selection:bg-amber-500/30 flex flex-col">
      {/* Assuming Navbar is global/fixed at top */}


      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Ambient Background Glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] bg-orange-950/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="hidden lg:flex w-72 flex-col shrink-0 border-r border-white/5 bg-[#050301]/80 backdrop-blur-xl relative z-10">
          <SidebarContent />
        </aside>

        {/* ── MOBILE SIDEBAR OVERLAY ── */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              />
              
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0603] border-r border-white/10 shadow-2xl flex flex-col lg:hidden"
              >
                {/* Close Button Mobile */}
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute top-6 right-4 p-2 text-neutral-400 hover:text-white bg-white/5 rounded-full backdrop-blur-md border border-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 flex flex-col min-w-0 h-full relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          
          {/* Mobile Header (Shows only on small screens to toggle sidebar) */}
          <div className="lg:hidden flex items-center gap-4 p-4 border-b border-white/5 bg-[#050301]/80 backdrop-blur-xl sticky top-0 z-30">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex-1">
              <p className="font-bold text-white text-sm">Dashboard</p>
            </div>
          </div>

          <div className="p-4 md:p-8">
            <PwaNetworkBanner moduleName="Staff Dashboard" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
        
      </div>
    </section>
  )
}