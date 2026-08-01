import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Clock, Package, CheckCircle2, ArrowRight, ShoppingBag, Activity } from 'lucide-react'
import { useAppSelector } from '@/app/hooks'
import { useGetMyOrdersQuery } from '@/features/orders/ordersApi'
import { cn } from '@/lib/utils'
import Spinner from '@/components/ui/Spinner'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_kitchen: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_kitchen: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  ready: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function CustomerDashboardPage() {
  const user = useAppSelector(state => state.auth.user)
  const { data: orders = [], isLoading } = useGetMyOrdersQuery()

  const activeOrders = orders.filter(order => !['completed', 'cancelled'].includes(order.status))
  const latestOrder = orders[0]
  const activeOrder = activeOrders[0] || latestOrder

  const totalOrders = orders.length
  const completedOrders = orders.filter(order => order.status === 'completed').length

  return (
    <div className="min-h-screen bg-[#050301] relative overflow-hidden selection:bg-amber-500/30 pb-24">
      <div className="fixed top-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-amber-900/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] bg-orange-950/15 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(245,158,11,0.1)] mb-4">
              <Activity size={12} /> Customer Dashboard
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
            </h1>
            <p className="text-sm md:text-base text-neutral-400 mt-3 max-w-2xl">
              Follow live order progress, review your purchase history, and jump back to the menu whenever you want.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-transform hover:-translate-y-0.5"
          >
            <ShoppingBag size={18} />
            Order More
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="min-h-[320px] flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard icon={Package} label="Total Orders" value={totalOrders.toString()} />
              <MetricCard icon={Clock} label="Active Orders" value={activeOrders.length.toString()} />
              <MetricCard icon={CheckCircle2} label="Completed" value={completedOrders.toString()} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="bg-white/[0.02] border border-white/10 rounded-[28px] p-6 md:p-8 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold">Live tracking</p>
                    <h2 className="text-2xl font-black text-white tracking-tight mt-2">Current order</h2>
                  </div>
                  {activeOrder && (
                    <span className={cn('px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider', STATUS_STYLES[activeOrder.status] || STATUS_STYLES.pending)}>
                      {STATUS_LABELS[activeOrder.status] || activeOrder.status}
                    </span>
                  )}
                </div>

                {activeOrder ? (
                  <div className="space-y-5">
                    <div className="rounded-2xl bg-black/30 border border-white/5 p-5">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-neutral-400 text-sm">Order number</p>
                          <h3 className="text-2xl font-black text-white tracking-tight mt-1">#{activeOrder.orderNumber}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-neutral-400 text-sm">Placed</p>
                          <p className="text-white font-medium mt-1">
                            {activeOrder.createdAt ? format(new Date(activeOrder.createdAt), 'PPp') : 'Recently'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3 text-sm">
                        <InfoPill label="Items" value={(activeOrder.items?.length || 0).toString()} />
                        <InfoPill label="Total" value={`${Number(activeOrder.totalAmount || 0).toFixed(0)} ETB`} />
                        <InfoPill label="Payment" value={activeOrder.payment?.status || 'unpaid'} />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to={`/order/${activeOrder.id}/track`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 text-black font-bold px-5 py-3 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:bg-amber-400 transition-colors"
                      >
                        Track live order
                        <ArrowRight size={18} />
                      </Link>
                      <Link
                        to="/menu"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] text-white font-semibold px-5 py-3 hover:bg-white/[0.06] transition-colors"
                      >
                        Back to menu
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 mb-4">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white">No active order right now</h3>
                    <p className="text-neutral-400 mt-2 max-w-md mx-auto">
                      When you place an order, this area will show live progress and a direct tracking link.
                    </p>
                    <Link
                      to="/menu"
                      className="inline-flex items-center justify-center gap-2 mt-6 rounded-xl bg-amber-500 text-black font-bold px-5 py-3"
                    >
                      Browse the menu
                    </Link>
                  </div>
                )}
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/[0.02] border border-white/10 rounded-[28px] p-6 md:p-8 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-end justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold">History</p>
                    <h2 className="text-2xl font-black text-white tracking-tight mt-2">Your orders</h2>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{orders.length} records</span>
                </div>

                {orders.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
                    <p className="text-white font-semibold">No order history yet</p>
                    <p className="text-neutral-400 text-sm mt-2">Your completed and active orders will appear here after your first purchase.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {orders.map((order) => (
                      <Link
                        key={order.id}
                        to={`/order/${order.id}/track`}
                        className="block rounded-2xl border border-white/5 bg-black/30 p-4 hover:border-amber-500/20 hover:bg-black/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-white font-bold tracking-tight">#{order.orderNumber}</p>
                            <p className="text-neutral-500 text-sm mt-1">
                              {order.createdAt ? format(new Date(order.createdAt), 'PPp') : 'Recently'}
                            </p>
                          </div>
                          <span className={cn('px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider', STATUS_STYLES[order.status] || STATUS_STYLES.pending)}>
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm text-neutral-300">
                          <span>{order.items?.length || 0} item(s)</span>
                          <span className="font-semibold text-white">{Number(order.totalAmount || 0).toFixed(0)} ETB</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.02] backdrop-blur-xl p-5 shadow-2xl flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-bold">{label}</p>
        <p className="text-3xl font-black text-white mt-1">{value}</p>
      </div>
    </div>
  )
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-bold">{label}</p>
      <p className="text-white font-semibold mt-1 truncate">{value}</p>
    </div>
  )
}