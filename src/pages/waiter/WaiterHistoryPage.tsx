import { useGetOrdersQuery } from '@/features/orders/ordersApi'
import { Clock, SearchX } from 'lucide-react'
import { useMemo } from 'react'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function WaiterHistoryPage() {
  const { branchId } = useCurrentBranch()
  const { data: allOrders = [], isLoading } = useGetOrdersQuery(
    { branchId: branchId || undefined },
    { pollingInterval: 10000, skip: !branchId }
  )

  const historyOrders = useMemo(() => {
    return allOrders.filter(o => ['in_kitchen', 'ready', 'completed'].includes(o.status))
  }, [allOrders])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (historyOrders.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-neutral-500">
        <SearchX size={48} className="mb-4 opacity-20" />
        <p className="text-sm font-bold tracking-widest uppercase">No history available</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto">
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[10px] md:text-xs uppercase tracking-widest bg-white/[0.02] text-neutral-400 border-b border-white/10">
            <tr>
              <th className="px-6 py-5 font-bold">Order Ref</th>
              <th className="px-6 py-5 font-bold">Fulfillment</th>
              <th className="px-6 py-5 font-bold">Timestamp</th>
              <th className="px-6 py-5 font-bold">Status</th>
              <th className="px-6 py-5 font-bold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {historyOrders.map((order, idx) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                key={order.id} 
                className="hover:bg-white/[0.04] transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="font-black text-white text-base">#{order.orderNumber}</div>
                  {order.customer && <div className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">{order.customer.email}</div>}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-white/10 bg-white/5 text-neutral-300">
                    {order.type === 'dine_in' ? `Table ${order.tableNumber}` : 'Takeaway'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-neutral-400 font-medium">
                    <Clock size={14} className="text-blue-500" />
                    <span>{new Date(order.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border",
                    order.status === 'in_kitchen' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    order.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                  )}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-black text-blue-400">
                  {Number(order.totalAmount).toFixed(0)} ETB
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}