import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useGetOrderByIdQuery } from '@/features/orders/ordersApi'
import { upsertOrder } from '@/features/orders/ordersSlice'
import { socketActions } from '@/features/socket/socketMiddleware'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Coffee, CheckCircle2, Clock, ChefHat, Check, XCircle, ArrowLeft } from 'lucide-react'

const STEPS = [
  { key: 'pending',    label: 'Order Received',   icon: Clock },
  { key: 'confirmed',  label: 'Confirmed',        icon: CheckCircle2 },
  { key: 'in_kitchen', label: 'Preparing',        icon: ChefHat },
  { key: 'ready',      label: 'Ready for Pickup', icon: Coffee },
  { key: 'completed',  label: 'Completed',        icon: Check },
]

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  const { data: order, isLoading } = useGetOrderByIdQuery(id!)
  const liveOrder = useAppSelector(state => state.orders.byId[id!])

  useEffect(() => {
    if (order) {
      dispatch(upsertOrder({
        id:          order.id,
        orderNumber: order.orderNumber,
        status:      order.status,
        branchId:    order.branchId,
      }))
      dispatch(socketActions.joinOrderRoom(order.id))
    }
  }, [order, dispatch])

  const currentStatus = liveOrder?.status ?? order?.status
  const currentStepIndex = STEPS.findIndex(s => s.key === currentStatus)

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-[#050301] px-6 py-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-amber-500">
          <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <p className="font-medium tracking-widest uppercase text-sm">Locating order...</p>
        </div>
      </div>
    )
  }

  if (currentStatus === 'cancelled') {
    return (
      <div className="min-h-screen bg-[#050301] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6">
          <XCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Order Cancelled</h2>
        <p className="text-neutral-400 mb-8 max-w-sm">We're sorry, but this order has been cancelled.</p>
        <Link to="/menu" className="bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl px-8 h-12 flex items-center justify-center transition-colors border border-white/10">
          Return to Menu
        </Link>
      </div>
    )
  }

  const isCompleted = currentStatus === 'completed'
  const isPreparing = currentStatus === 'in_kitchen'

  return (
    <div className="min-h-screen bg-[#050301] selection:bg-amber-500/30 relative overflow-hidden pb-24">
      {/* Ambient Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-900/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-orange-950/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-[#050301]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">

        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 relative z-10">
        
        <Link to="/menu" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to menu
        </Link>

        {/* Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#110a05] border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Animated background gradient based on status */}
          <div className={cn(
            "absolute inset-0 opacity-20 transition-colors duration-1000",
            isCompleted ? "bg-gradient-to-br from-emerald-500/20" : 
            isPreparing ? "bg-gradient-to-br from-amber-500/20" : "bg-gradient-to-br from-white/5"
          )} />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-bold uppercase tracking-widest">
              Live Updates
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              Order #{order.orderNumber}
            </h1>
            <p className="text-amber-500 font-medium tracking-wide">
              {isCompleted ? "Enjoy your meal!" : "We're working on your order."}
            </p>
          </div>
        </motion.div>

        {/* Tracking Timeline */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="mt-8 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 backdrop-blur-xl"
>
  <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
    {STEPS.map((step, i) => {
      const isDone = i < currentStepIndex || isCompleted
      const isActive = i === currentStepIndex

      // ✅ Get the icon component for this step
      const StepIcon = step.icon

      return (
        <div
          key={step.key}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          {/* Icon Marker */}
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-2xl border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl transition-all duration-500 z-10",
              isActive
                ? "bg-amber-500 border-amber-400 text-black scale-110 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                : isDone
                ? "bg-white/10 border-white/20 text-white"
                : "bg-black/50 border-white/5 text-neutral-600"
            )}
          >
            <StepIcon
              size={20}
              className={cn(isActive && "animate-pulse")}
            />
          </div>

          {/* Content Box */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "font-bold text-base tracking-tight transition-colors",
                  isActive
                    ? "text-amber-500"
                    : isDone
                    ? "text-white"
                    : "text-neutral-500"
                )}
              >
                {step.label}
              </h3>

              {isActive && (
                <span className="flex gap-1 ml-3 shrink-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </span>
              )}
            </div>
          </div>
        </div>
      )
    })}
  </div>
</motion.div>

      </div>
    </div>
  )
}