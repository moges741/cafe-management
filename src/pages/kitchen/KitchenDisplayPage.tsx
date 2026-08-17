import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/features/orders/ordersApi'
import { useGetCategoriesQuery } from '@/features/categories/categoriesApi'
import { upsertOrder } from '@/features/orders/ordersSlice'
import { selectActiveOrders } from '@/features/orders/ordersSelectors'
import { socketActions } from '@/features/socket/socketMiddleware'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import { cn } from '@/lib/utils'
import { Timer, AlertCircle, ChefHat } from 'lucide-react'
import toast from 'react-hot-toast'

const COLUMNS = [
  { status: 'confirmed',  title: 'New Orders',   accent: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', text: 'text-blue-400' },
  { status: 'in_kitchen', title: 'Preparing',   accent: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/30',  text: 'text-amber-400' },
  { status: 'ready',      title: 'Ready',       accent: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/30', text: 'text-emerald-400' },
]

const NEXT_STATUS: Record<string, { label: string; next: string; color: string }> = {
  confirmed:  { label: 'Start Prep',  next: 'in_kitchen', color: 'bg-blue-500 hover:bg-blue-400' },
  in_kitchen: { label: 'Mark Ready',  next: 'ready',      color: 'bg-amber-500 hover:bg-amber-400 text-black' },
  ready:      { label: 'Complete',    next: 'completed',  color: 'bg-emerald-500 hover:bg-emerald-400 text-black' },
}

// Live-updating timer
function useElapsed(createdAt?: string) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!createdAt) return
    const start = new Date(createdAt).getTime()
    const tick = () => setSeconds(Math.floor((Date.now() - start) / 1000))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [createdAt])
  return seconds
}

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function KitchenDisplayPage() {
  const { branchId } = useCurrentBranch()
  const dispatch = useAppDispatch()
  const { data: initialOrders } = useGetOrdersQuery({ branchId: branchId || undefined }, { skip: !branchId })
  const { data: categories = [] } = useGetCategoriesQuery({ branchId: branchId || undefined }, { skip: !branchId })
  const liveOrders = useAppSelector(selectActiveOrders)
  const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation()

  const drinkCategoryIds = useMemo(() => {
    return categories
      .filter(c => ['drink', 'coffee', 'tea', 'beverage'].some(k => c.name.toLowerCase().includes(k)))
      .map(c => c.id)
  }, [categories])

  useEffect(() => {
    dispatch(socketActions.connect())
  }, [dispatch])

  useEffect(() => {
    if (initialOrders) {
      initialOrders.forEach(o => dispatch(upsertOrder({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        branchId: o.branchId,
        createdAt: o.createdAt,
        payment: o.payment,
        items: o.items,
        type: o.type,
        tableNumber: o.tableNumber
      })))
    }
    if (branchId) {
      dispatch(socketActions.joinKitchen(branchId))
    }
  }, [initialOrders, dispatch, branchId])

  const handleAdvance = async (orderId: string, nextStatus: string) => {
    if (!navigator.onLine) {
      toast.error('Network offline: Internet connection is required to update order status.', {
        icon: '📡',
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
      })
      return
    }

    try {
      await updateStatus({ orderId, status: nextStatus }).unwrap()
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Could not update order')
    }
  }

  // Filter out orders that are strictly 100% drinks (they go to the barista)
  const kitchenOrders = useMemo(() => {
    return liveOrders.filter((order: any) => {
      if (!order.items || order.items.length === 0) return true
      const isDrinkOnly = order.items.every((item: any) => 
        drinkCategoryIds.includes(item.product?.categoryId || item.categoryId)
      )
      return !isDrinkOnly
    })
  }, [liveOrders, drinkCategoryIds])

  return (
    <div className="h-[100dvh] bg-[#050505] p-4 md:p-6 font-sans text-white overflow-hidden flex flex-col">
      {/* Header - Responsive padding and sizing */}
      <div className="flex flex-row items-center justify-between mb-4 md:mb-8 shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center shadow-lg shrink-0">
            <ChefHat className="text-amber-500 w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase leading-none md:leading-normal">Live Kitchen</h1>
            <p className="text-[10px] md:text-xs font-medium text-neutral-500 tracking-widest uppercase mt-0.5 md:mt-1 hidden sm:block">
              Synchronized Service Matrix
            </p>
          </div>
        </div>
        
        <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/[0.03] border border-white/10 flex items-center gap-2 md:gap-3 shadow-inner shrink-0">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-xs md:text-sm font-semibold tracking-wide text-neutral-300">
              {kitchenOrders.length} <span className="hidden sm:inline">Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Board - Snap scrolling on mobile, standard horizontal scroll on desktop */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden md:[&::-webkit-scrollbar]:block">
        <div className="flex gap-4 md:gap-6 h-full min-w-max">
          {COLUMNS.map((col) => {
            const ordersInColumn = kitchenOrders.filter((o: any) => {
              if (o.status !== col.status) return false
              if (col.status === 'pending' && (!o.payment || (o.payment.method === 'chapa' && o.payment.status !== 'completed'))) {
                return false
              }
              return true
            })

            return (
              <div 
                key={col.status} 
                className="w-[85vw] sm:w-[300px] md:w-[340px] shrink-0 snap-center md:snap-align-none flex flex-col h-full rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden shadow-xl"
              >
                {/* Column Header */}
                <div className={cn("px-4 md:px-5 py-3 md:py-4 border-b flex items-center justify-between bg-gradient-to-r", col.accent, col.border)}>
                  <h2 className={cn("text-xs md:text-sm font-bold uppercase tracking-widest", col.text)}>{col.title}</h2>
                  <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-black/40 flex items-center justify-center text-[10px] md:text-xs font-bold text-white border border-white/10">
                    {ordersInColumn.length}
                  </span>
                </div>

                {/* Column Body */}
                <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                  <AnimatePresence>
                    {ordersInColumn.map((order) => (
                      <OrderTicket
                        key={order.id}
                        order={order}
                        action={NEXT_STATUS[order.status]}
                        disabled={isLoading}
                        onAdvance={handleAdvance}
                      />
                    ))}
                  </AnimatePresence>
                  {ordersInColumn.length === 0 && (
                    <div className="h-full min-h-[150px] md:min-h-[200px] flex flex-col items-center justify-center text-neutral-600 opacity-50">
                      <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-dashed border-neutral-600 rounded-full mb-3" />
                      <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase">No Orders</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function OrderTicket({ order, action, disabled, onAdvance }: any) {
  const elapsed = useElapsed(order.createdAt ?? new Date().toISOString())
  const isUrgent = elapsed > 600 // over 10 minutes

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        'relative rounded-2xl bg-[#0b0b0b] border p-4 md:p-5 shadow-lg group',
        isUrgent ? 'border-red-500/40 shadow-[0_4px_20px_rgba(239,68,68,0.1)]' : 'border-white/10'
      )}
    >
      {isUrgent && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full animate-ping" />
      )}

      {/* Header Info */}
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white block leading-none">
            #{order.orderNumber}
          </span>
          <span className="text-[10px] md:text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1 md:mt-1 block">
            {order.type === 'dine_in' ? `Table ${order.tableNumber}` : 'Takeaway'}
          </span>
        </div>
        
        <div className={cn(
          'flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-2.5 rounded-md text-[10px] md:text-xs font-bold font-mono border',
          isUrgent 
            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
            : 'bg-white/5 text-neutral-400 border-white/10'
        )}>
          {isUrgent ? <AlertCircle size={10} className="md:w-3 md:h-3" /> : <Timer size={10} className="md:w-3 md:h-3" />}
          {formatElapsed(elapsed)}
        </div>
      </div>

      {/* Items Preview */}
      {order.items && order.items.length > 0 && (
        <ul className="mb-4 md:mb-5 space-y-1.5 md:space-y-2">
          {order.items.slice(0, 3).map((item: any, i: number) => (
            <li key={i} className="text-xs md:text-sm flex items-start gap-2 text-neutral-300">
              <span className="font-black text-amber-500">{item.quantity}x</span>
              <span className="leading-snug">{item.productName || item.product?.name || 'Item'}</span>
            </li>
          ))}
          {order.items.length > 3 && (
            <li className="text-[10px] md:text-xs font-semibold text-neutral-500 pt-1">+ {order.items.length - 3} more items</li>
          )}
        </ul>
      )}

      {/* Action Button */}
      {action && (
        <button
          disabled={disabled}
          onClick={() => onAdvance(order.id, action.next)}
          className={cn(
            "w-full py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-black tracking-widest uppercase transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:active:scale-100",
            action.color,
            isUrgent && "shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          )}
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}