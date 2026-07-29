import { useGetOrdersQuery } from '@/features/orders/ordersApi'
import { useGetCategoriesQuery } from '@/features/categories/categoriesApi'
import { Clock, Coffee, SearchX } from 'lucide-react'
import { useMemo, useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { socketActions } from '@/features/socket/socketMiddleware'
import { motion } from 'framer-motion'
import { SkeletonTableRow } from '@/components/ui/Skeleton'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'

export default function BaristaHistoryPage() {
  const { branchId } = useCurrentBranch()
  const dispatch = useAppDispatch()
  
  const { data: allOrders = [], isLoading: isLoadingOrders } = useGetOrdersQuery(
    { branchId: branchId || undefined, days: 10 },
    { skip: !branchId }
  )
  
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery(
    { branchId: branchId || undefined }, 
    { skip: !branchId }
  )

  useEffect(() => {
    dispatch(socketActions.connect())
    if (branchId) {
      dispatch(socketActions.joinKitchen(branchId)) // Kitchen and Barista share the same event room
    }
  }, [dispatch, branchId])

  const drinkCategoryIds = useMemo(() => {
    return categories
      .filter(c => ['drink', 'coffee', 'tea', 'beverage'].some(k => c.name.toLowerCase().includes(k)))
      .map(c => c.id)
  }, [categories])

  const historyOrders = useMemo(() => {
    return allOrders.filter(o => {
      // Must be completed
      if (o.status !== 'completed') return false
      // Must have items
      if (!o.items || o.items.length === 0) return false
      // Every item must be a drink
      return o.items.every((item: any) => 
        drinkCategoryIds.includes(item.product?.categoryId || item.categoryId)
      )
    })
  }, [allOrders, drinkCategoryIds])

  const isLoading = isLoadingOrders || isLoadingCategories

  return (
    <div className="min-h-screen bg-[#050301] p-6 h-full overflow-y-auto font-sans">
      
      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <Coffee size={28} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Barista Archive</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-8 h-[2px] bg-amber-500 rounded-full" />
              <p className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                Completed Drinks • Last 10 Days
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-4xl font-black text-white">{historyOrders.length}</span>
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest ml-2 block">
            Total Fulfilled
          </span>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="overflow-x-auto rounded-[32px] border border-white/5 bg-[#120804]/80 backdrop-blur-md shadow-lg max-w-7xl mx-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs uppercase tracking-widest bg-black/40 text-neutral-400 border-b border-white/5">
            <tr>
              <th className="px-8 py-5 font-bold">Order Ref</th>
              <th className="px-8 py-5 font-bold">Fulfillment Type</th>
              <th className="px-8 py-5 font-bold">Time Completed</th>
              <th className="px-8 py-5 font-bold">Drink Summary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} cols={4} />)
            ) : historyOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-32 text-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <div className="w-[40vw] h-[40vw] bg-amber-500 rounded-full blur-[100px]" />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4 relative z-10">
                    <div className="w-20 h-20 bg-white/[0.02] border border-white/10 rounded-full flex items-center justify-center shadow-inner">
                      <SearchX size={32} className="text-neutral-500" />
                    </div>
                    <p className="text-lg font-bold text-white tracking-wide">No Historical Data</p>
                    <p className="text-xs font-medium text-neutral-500 tracking-widest uppercase">
                      Awaiting completed drinks for this period.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              historyOrders.map((order, idx) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
                  className="hover:bg-white/[0.04] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="inline-flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-neutral-600 group-hover:bg-amber-500 transition-colors" />
                      <span className="font-black text-white text-base">#{order.orderNumber}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md border border-white/10 bg-white/5 text-neutral-300">
                      {order.type === 'dine_in' ? `Table ${order.tableNumber}` : 'Takeaway'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-neutral-400 font-medium">
                      <Clock size={16} className="text-amber-500" />
                      <span>{new Date(order.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-neutral-600 ml-1 font-mono text-xs">
                        {new Date(order.createdAt!).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-2">
                      {order.items?.slice(0, 2).map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs bg-black/40 border border-white/5 px-2.5 py-1 rounded-full">
                          <span className="font-black text-amber-500">{item.quantity}x</span>
                          <span className="text-neutral-300">{item.product?.name || item.productName || 'Drink'}</span>
                        </div>
                      ))}
                      {order.items && order.items.length > 2 && (
                        <div className="flex items-center justify-center w-8 h-6 bg-white/[0.03] border border-white/10 rounded-full text-[10px] text-neutral-400 font-bold">
                          +{order.items.length - 2}
                        </div>
                      )}
                    </div>
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
