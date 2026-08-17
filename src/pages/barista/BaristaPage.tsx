import { useEffect } from 'react'
import { Coffee } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/features/orders/ordersApi'
import { useGetCategoriesQuery } from '@/features/categories/categoriesApi'
import { upsertOrder } from '@/features/orders/ordersSlice'
import { selectActiveOrders } from '@/features/orders/ordersSelectors'
import { socketActions } from '@/features/socket/socketMiddleware'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const COLUMNS = [
  { status: 'confirmed',  title: 'Confirmed', action: { label: 'Start prep',   next: 'in_kitchen' } },
  { status: 'in_kitchen', title: 'Preparing', action: { label: 'Mark ready',   next: 'ready' } },
  { status: 'ready',      title: 'Ready',     action: { label: 'Complete',     next: 'completed' } },
]

export default function BaristaPage() {
  const { branchId } = useCurrentBranch()
  const dispatch = useAppDispatch()
  const connected = useAppSelector(state => state.socket.connected)
  const { data: initialOrders } = useGetOrdersQuery({ branchId: branchId || undefined }, { skip: !branchId })
  const { data: categories = [] } = useGetCategoriesQuery({ branchId: branchId || undefined }, { skip: !branchId })
  const liveOrders = useAppSelector(selectActiveOrders)
  const [updateStatus] = useUpdateOrderStatusMutation()

  const drinkCategoryIds = categories
    .filter(c => ['drink', 'coffee', 'tea', 'beverage'].some(k => c.name.toLowerCase().includes(k)))
    .map(c => c.id)

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
  }, [initialOrders, dispatch])

  useEffect(() => {
    if (connected && branchId) dispatch(socketActions.joinKitchen(branchId))
  }, [connected, dispatch, branchId])

  // Filter to show ONLY orders where 100% of the items are drinks
  const drinkOrders = liveOrders.filter((order: any) => {
    if (!order.items || order.items.length === 0) return false
    return order.items.every((item: any) => 
      drinkCategoryIds.includes(item.product?.categoryId || item.categoryId)
    )
  })

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

  return (
    <div className="min-h-screen bg-[#050301] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Coffee size={28} className="text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Barista Station</h1>
              <p className="text-neutral-400 text-sm mt-1">Manage live beverage orders</p>
            </div>
          </div>
          <div className={cn(
            'flex items-center gap-2 text-xs px-4 py-2 rounded-full font-medium border',
            connected 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          )}>
            <span className={cn('w-2 h-2 rounded-full', connected ? 'bg-amber-500 animate-pulse' : 'bg-red-500')} />
            {connected ? 'Live Sync Active' : 'Reconnecting...'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {COLUMNS.map((col) => {
            const orders = drinkOrders.filter(o => o.status === col.status)

            return (
              <div key={col.status} className="bg-[#120804]/80 backdrop-blur-md rounded-[32px] border border-white/5 p-5 flex flex-col min-h-[70vh]">
                <div className="flex items-center justify-between mb-6 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 rounded-full bg-amber-500/50" />
                    <span className="text-lg font-bold text-white tracking-wide">{col.title}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-sm">
                    {orders.length}
                  </span>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-black/40 rounded-2xl border border-white/10 p-5 animate-in fade-in slide-in-from-top-4 hover:border-amber-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                        <span className="font-black text-white text-xl">#{order.orderNumber}</span>
                        {order.tableNumber && (
                          <span className="text-xs font-semibold bg-white/10 text-neutral-300 px-2 py-1 rounded-md">
                            Table {order.tableNumber}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex items-start justify-between">
                            <div>
                              <p className="text-neutral-200 font-medium">{item.quantity}x {item.product?.name}</p>
                              {item.notes && (
                                <p className="text-xs text-amber-400/80 mt-1 italic block">— {item.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button 
                        size="default" 
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 rounded-xl text-base"
                        onClick={() => handleAdvance(order.id, col.action.next)}
                      >
                        {col.action.label}
                      </Button>
                    </div>
                  ))}

                  {orders.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                      <Coffee className="w-12 h-12 mb-4" />
                      <p className="text-sm font-medium">No orders in this queue</p>
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