import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/features/orders/ordersApi'
import { Clock, Send, ConciergeBell, AlertCircle } from 'lucide-react'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import toast from 'react-hot-toast'
import { useMemo, useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { socketActions } from '@/features/socket/socketMiddleware'
import { motion, AnimatePresence } from 'framer-motion'
import { SkeletonOrderRow } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

export default function WaiterIncomingOrdersPage() {
  const { branchId } = useCurrentBranch()
  const dispatch = useAppDispatch()
  const { data: allOrders = [], isLoading } = useGetOrdersQuery(
    { branchId: branchId || undefined },
    { skip: !branchId }
  )

  useEffect(() => {
    dispatch(socketActions.connect())
    if (branchId) {
      dispatch(socketActions.joinKitchen(branchId)) // we can listen to the same room for new orders
    }
  }, [dispatch, branchId])
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()

  const incomingOrders = useMemo(() => {
    return allOrders.filter(o => o.status === 'pending')
  }, [allOrders])

  const handleSendToKitchen = async (orderId: string) => {
    try {
      await updateStatus({ orderId, status: 'confirmed' }).unwrap()
      toast.success('Order sent to kitchen!')
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.error?.message || 'Failed to send')
    }
  }

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto custom-scrollbar">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonOrderRow key={i} />)}
        </div>
      ) : incomingOrders.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-neutral-500 pt-10">
          <div className="relative">
             <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full" />
             <ConciergeBell size={64} className="mb-4 opacity-30 relative z-10" />
          </div>
          <p className="text-sm font-bold tracking-widest uppercase">Floor is clear</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {incomingOrders.map((order) => {
              const isPaid = order.payment?.status === 'completed'
              const isTakeaway = order.type === 'takeaway'

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={order.id} 
                  className={cn(
                    "bg-[#0b0b0b] border rounded-2xl flex flex-col overflow-hidden shadow-lg",
                    isTakeaway ? 'border-orange-500/30' : 'border-white/10'
                  )}
                >
                  <div className={cn("p-4 border-b", isTakeaway ? 'bg-orange-500/5 border-orange-500/20' : 'bg-white/[0.02] border-white/5')}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tighter leading-none">#{order.orderNumber}</h3>
                        <p className="text-[10px] text-neutral-400 font-medium flex items-center gap-1.5 mt-2 uppercase tracking-wider">
                          <Clock size={12} className="text-blue-400" />
                          {new Date(order.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-blue-400 block leading-none">{Number(order.totalAmount).toFixed(0)} ETB</span>
                        <div className={cn("text-[10px] uppercase tracking-widest mt-2 font-bold", isTakeaway ? 'text-orange-500' : 'text-neutral-300')}>
                          {isTakeaway ? 'Takeaway' : `Table ${order.tableNumber || '?'}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {order.customer ? (
                        <p className="text-[11px] text-neutral-300 font-medium truncate max-w-[120px]">
                          <span className="opacity-50">👤</span> {order.customer.email}
                        </p>
                      ) : <div/>}
                      
                      <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest",
                        isPaid ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      )}>
                        {isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 overflow-y-auto max-h-[200px] custom-scrollbar">
                    <ul className="space-y-3">
                      {order.items?.map((item: any, idx: number) => (
                        <li key={idx} className="text-sm">
                          <div className="flex items-start">
                            <span className="font-black text-blue-400 mr-2.5 shrink-0">{item.quantity}x</span>
                            <span className="font-medium text-neutral-200 leading-snug">
                              {item.product?.name || item.productName || 'Item'}
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-neutral-400 mt-1.5 flex gap-1.5 items-start bg-white/5 p-1.5 rounded-md">
                              <AlertCircle size={12} className="shrink-0 mt-0.5 text-amber-500" />
                              <span className="italic">{item.notes}</span>
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 border-t border-white/5 bg-[#050505]">
                    <button 
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        isPaid 
                          ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-95" 
                          : "bg-white/5 text-neutral-500 border border-white/10 cursor-not-allowed"
                      )}
                      onClick={() => handleSendToKitchen(order.id)}
                      disabled={isUpdating || !isPaid}
                    >
                      <Send size={14} />
                      {!isPaid ? 'Awaiting Payment' : 'Push to Kitchen'}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}