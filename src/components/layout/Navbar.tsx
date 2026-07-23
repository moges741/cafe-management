import React, { useState, useEffect } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
import {
  Coffee,
  ShoppingBag,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { clearUser, type UserRole } from '@/features/auth/authSlice'
import Logo from '/logo.svg'

type NavItem = { name: string; href: string }

const NAV_LINKS: NavItem[] = [
  { name: 'Menu', href: '/menu' },
  { name: 'About', href: '/about' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
]

const ROLE_ROUTES: Record<UserRole, string> = {
  admin: '/admin',
  manager: '/admin',
  kitchen: '/kitchen',
  cashier: '/cashier',
  waiter: '/waiter',
  barista: '/barista',
  customer: '/menu',
}

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const cartItems = useAppSelector(state => state.cart.items)

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 20)
  })

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const handleLogout = () => {
    dispatch(clearUser())
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
    navigate('/login')
  }

  const handleDashboardNavigate = () => {
    if (user?.role) {
      const dashboardRoute = ROLE_ROUTES[user.role]
      navigate(dashboardRoute)
      setIsDropdownOpen(false)
      setIsMobileMenuOpen(false)
    }
  }

  const handleCartClick = () => {
    navigate('/cart')
    setIsMobileMenuOpen(false)
  }

  const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      admin: 'Admin',
      manager: 'Manager',
      kitchen: 'Kitchen',
      cashier: 'Cashier',
      waiter: 'Waiter',
      barista: 'Barista',
      customer: 'Profile',
    }
    return labels[role]
  }

  return (
    <>

      <motion.nav
        initial={{ y: -50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
className="fixed top-6 left-0 right-0 mx-auto w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-[1200px] z-50 will-change-transform"      >
        <motion.div
          animate={{
            height: isScrolled ? '4.5rem' : '5rem',
            backgroundColor: isScrolled
              ? 'rgba(10, 5, 2, 0.85)'
              : 'rgba(20, 10, 5, 0.5)',
            backdropFilter: isScrolled ? 'blur(24px)' : 'blur(16px)',
            borderColor: isScrolled
              ? 'rgba(245, 158, 11, 0.2)'
              : 'rgba(255, 255, 255, 0.1)',
            boxShadow: isScrolled
              ? '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.1)'
              : '0 10px 30px -10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            scale: isScrolled ? 0.98 : 1,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          whileHover={{ scale: isScrolled ? 0.99 : 1.01 }}
          className="w-full rounded-full border flex items-center justify-between px-4 md:px-8 overflow-visible relative"
        >
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" />

          {/* ----- LOGO ----- */}
       <Link to="/" className="flex items-center gap-3">
  <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20">
    <img
      src={Logo}
      alt="Mr. Cafe Logo"
      className="w-full h-full object-contain transition-all duration-500 ease-out hover:scale-150 drop-shadow-[0_0_20px_rgba(245,158,11,0.35)]"
      draggable={false}
    />
  </div>
</Link>

          {/* ----- DESKTOP LINKS ----- */}
          <div className="hidden lg:flex items-center gap-1 relative z-10">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  if (link.href.startsWith('/')) {
                    navigate(link.href)
                  } else {
                    window.location.href = link.href
                  }
                }}
                className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 text-neutral-300 hover:text-amber-100"
              >
                <span className="relative z-10">{link.name}</span>
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4 relative z-10">
            {/* Cart Button */}
            <motion.button
              onClick={handleCartClick}
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center rounded-full translate-x-1 -translate-y-1 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                  {cartItems.length}
                </span>
              )}
            </motion.button>

            {/* Auth Logic (Login / Profile) */}
            {isAuthenticated && user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:border-amber-500/50 transition-all duration-300"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium">
                    {getRoleLabel(user.role)}
                  </span>
                </motion.button>

                {/* Role-Based Dropdown */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-48 rounded-2xl bg-[#120804]/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden py-2"
                    >
                      {user.role !== 'customer' && (
                        <button
                          onClick={handleDashboardNavigate}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors text-left"
                        >
                          <Settings className="w-4 h-4" /> Dashboard
                        </button>
                      )}
                      {user.role === 'customer' && (
                        <button
                          onClick={() => {
                            navigate('/menu')
                            setIsDropdownOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors text-left"
                        >
                          <ShoppingBag className="w-4 h-4" /> Orders
                        </button>
                      )}
                      <div className="h-px w-full bg-white/10 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{
                  y: -2,
                  scale: 1.05,
                  boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent hover:left-[100%] transition-all duration-700 ease-in-out" />
              </motion.button>
            )}
          </div>

          {/* ----- MOBILE MENU TOGGLE ----- */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden relative z-10 p-2 text-neutral-300 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </motion.div>
      </motion.nav>

      {/* ================= MOBILE FULL-SCREEN MENU ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-[#050301]/95 flex flex-col"
          >
            {/* Top Bar inside Mobile Menu */}
            <div className="flex items-center justify-between p-6 md:p-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-black" strokeWidth={2.5} />
                </div>
                <span className="text-lg font-bold text-white">Mr. Cafe</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 px-8 py-10 flex flex-col justify-center gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.name}
                  onClick={() => {
                    if (link.href.startsWith('/')) {
                      navigate(link.href)
                    } else {
                      window.location.href = link.href
                    }
                    setIsMobileMenuOpen(false)
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                  className="flex items-center justify-between text-3xl font-medium text-neutral-400 hover:text-amber-400 transition-colors group text-left"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </motion.button>
              ))}
            </div>

            {/* Bottom Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
              className="p-8 pb-12 grid grid-cols-2 gap-4 border-t border-white/10 bg-white/5"
            >
              {isAuthenticated && user ? (
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="col-span-2 py-4 rounded-xl border border-white/20 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5 text-amber-400" />
                  Sign Out
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCartClick}
                    className="py-4 rounded-xl border border-white/20 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5 text-neutral-400" />
                    Cart ({cartItems.length})
                  </button>
                  <button
                    onClick={() => {
                      navigate('/login')
                      setIsMobileMenuOpen(false)
                    }}
                    className="py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  >
                    Sign In
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}