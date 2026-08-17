import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Trash2, Plus, Minus, Coffee, WifiOff, AlertTriangle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { removeItem, updateQuantity } from '@/features/cart/cartSlice'
import { selectCartItems, selectCartTotal } from '@/features/cart/cartSelectors'
import { Button } from '@/components/ui/button'
import { usePwaCartValidation } from '@/hooks/usePwaCartValidation'
import toast from 'react-hot-toast'

// Framer Motion Variants
const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants: any = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
}

export default function CartPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const { isOnline, invalidItems, hasUnavailableItems } = usePwaCartValidation()

  // ── Empty State ──
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#050301] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-amber-500/30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center max-w-sm"
        >
          <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-amber-500/50 mb-8 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
            <ShoppingBag size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-3">Your cart is empty</h2>
          <p className="text-neutral-400 font-medium mb-10">
            Looks like you haven't added anything yet. Discover our artisanal menu and find your next favorite brew.
          </p>
          <Button 
            onClick={() => navigate('/menu')}
            className="h-12 px-8 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all w-full sm:w-auto"
          >
            Browse the Menu
          </Button>
        </motion.div>
      </div>
    )
  }

  // ── Filled State ──
  return (
    <div className="min-h-screen bg-[#050301] selection:bg-amber-500/30 relative overflow-hidden pb-24">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-0 left-[-10%] w-[400px] h-[400px] bg-orange-950/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="max-w-2xl mx-auto px-6 py-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Review your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">order</span>
          </h1>
        </motion.div>

        {!isOnline && (
          <div className="p-4 mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs md:text-sm flex items-center gap-3 shadow-md">
            <WifiOff size={18} className="shrink-0 text-amber-400 animate-pulse" />
            <div>
              <span className="font-bold">Offline Cart Mode:</span> You can continue reviewing and managing your cart. Internet connection is required to proceed to checkout and place an order.
            </div>
          </div>
        )}

        {hasUnavailableItems && (
          <div className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs md:text-sm flex items-center gap-3 shadow-md">
            <AlertTriangle size={18} className="shrink-0 text-red-400" />
            <div>
              <span className="font-bold">Action Required:</span> Some items in your cart are currently unavailable or removed. Please remove them before proceeding.
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 mb-10"
        >
          <AnimatePresence>
            {items.map((item) => {
              const invalidInfo = invalidItems.find(i => i.productId === item.productId)
              const isItemUnavailable = invalidInfo?.reason === 'unavailable' || invalidInfo?.reason === 'removed'

              return (
                <motion.div
                  key={item.productId}
                  variants={itemVariants}
                  exit="exit"
                  layout
                  className={`group relative flex flex-col sm:flex-row sm:items-center gap-4 bg-white/[0.02] border rounded-[24px] p-4 backdrop-blur-xl transition-colors ${
                    isItemUnavailable ? 'border-red-500/40 bg-red-500/5' : 'border-white/10 hover:border-amber-500/30'
                  }`}
                >
                  {/* Item Info */}
                  <div className="flex-1 min-w-0 flex items-start gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-center text-amber-500/50">
                      <Coffee size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white truncate leading-tight flex items-center gap-2">
                        {item.productName}
                        {isItemUnavailable && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold uppercase tracking-wider">
                            Unavailable
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-amber-500 font-semibold mt-0.5">{item.unitPrice} ETB</p>
                      {item.notes && (
                        <p className="text-xs mt-1.5 text-neutral-400 bg-black/40 inline-block px-2 py-1 rounded-md border border-white/5">
                          <span className="text-neutral-500">Note:</span> {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Controls Area */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:pl-4 mt-2 sm:mt-0">
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-black/60 border border-white/10 rounded-full p-1 shadow-inner">
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) }))}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => dispatch(removeItem(item.productId))}
                      className="p-2.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Checkout Summary Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Subtle inside glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="text-neutral-400 font-medium text-lg">Subtotal</span>
            <span className="text-2xl font-black text-white">{total.toFixed(0)} ETB</span>
          </div>

          <Button 
            className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-black text-lg font-bold rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (!navigator.onLine) {
                toast.error('Network offline: An active internet connection is required to proceed to checkout.', {
                  icon: '📡',
                  style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
                })
                return
              }
              if (hasUnavailableItems) {
                toast.error('Please remove unavailable items before proceeding to checkout.')
                return
              }
              navigate('/checkout')
            }}
            disabled={hasUnavailableItems}
          >
            {!isOnline ? 'Checkout (Offline)' : hasUnavailableItems ? 'Unavailable Items in Cart' : 'Proceed to Checkout'}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}