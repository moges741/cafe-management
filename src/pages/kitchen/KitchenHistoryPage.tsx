import { useGetOrdersQuery } from '@/features/orders/ordersApi'
import { Clock, ChefHat } from 'lucide-react'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SkeletonTableRow } from '@/components/ui/Skeleton'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

export default function KitchenHistoryPage() {
  const { data: allOrders = [], isLoading } = useGetOrdersQuery(
    { branchId: BRANCH_ID, days: 10 },
    { pollingInterval: 10000 }
  )

  const historyOrders = useMemo(() => {
    return allOrders.filter(o => o.status === 'completed')
  }, [allOrders])

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Completed Orders</h2>
        <p className="text-sm text-neutral-400 mt-1">Showing history for the last 10 days.</p>
      </div>

      <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-white/[0.04] text-neutral-400 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">Order</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Type</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Time Completed</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Items</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} cols={4} />)
            ) : historyOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-neutral-500">
                    <ChefHat size={40} className="opacity-20" />
                    <p className="font-medium">No completed orders in the last 10 days</p>
                  </div>
                </td>
              </tr>
            ) : (
              historyOrders.map((order, idx) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="hover:bg-white/[0.04] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-300">
                    {order.type === 'dine_in' ? `Table ${order.tableNumber}` : 'Takeaway'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <Clock size={14} className="text-amber-500" />
                      {new Date(order.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="text-xs text-neutral-500 ml-2">
                        ({new Date(order.createdAt!).toLocaleDateString()})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="text-xs space-y-1 text-neutral-300">
                      {order.items?.map((item: any, i: number) => (
                        <li key={i}>
                          <span className="font-bold text-amber-400 mr-1">{item.quantity}x</span>
                          {item.product?.name || item.productName || 'Item'}
                        </li>
                      ))}
                    </ul>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
