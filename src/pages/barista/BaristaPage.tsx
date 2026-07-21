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
        id: o.id, orderNumber: o.orderNumber, status: o.status, branchId: o.branchId,
      })))
    }
  }, [initialOrders, dispatch])

  useEffect(() => {
    if (connected && branchId) dispatch(socketActions.joinKitchen(branchId))
  }, [connected, dispatch, branchId])

  // If the order has `items` with category info, filter to drink orders only.
  // If items aren't present on the order object yet, fall back to showing everything
  // rather than silently hiding all orders — safer default until backend confirms shape.
 const drinkOrders = liveOrders.filter((order: any) => {
  if (!order.items) return true
  return order.items.some((item: any) => drinkCategoryIds.includes(item.product?.categoryId))
})

  const handleAdvance = async (orderId: string, nextStatus: string) => {
    try {
      await updateStatus({ orderId, status: nextStatus }).unwrap()
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Could not update order')
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Coffee size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Barista queue</h1>
        </div>
        <span className={cn(
          'flex items-center gap-2 text-xs px-3 py-1 rounded-full',
          connected ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'
        )}>
          <span className={cn('w-1.5 h-1.5 rounded-full', connected ? 'bg-primary animate-pulse' : 'bg-destructive')} />
          {connected ? 'Live' : 'Reconnecting...'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const orders = drinkOrders.filter(o => o.status === col.status)

          return (
            <div key={col.status} className="bg-card rounded-2xl border border-border p-3 min-h-[60vh]">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-sm font-semibold text-foreground">{col.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                  {orders.length}
                </span>
              </div>

              <div className="space-y-2">
                {orders.map((order) => (
                  <div key={order.id} className="bg-background rounded-xl border border-border p-3 animate-in fade-in slide-in-from-top-2">
                    <p className="font-bold text-foreground text-lg">{order.orderNumber}</p>
                    <Button size="sm" className="w-full mt-2" onClick={() => handleAdvance(order.id, col.action.next)}>
                      {col.action.label}
                    </Button>
                  </div>
                ))}

                {orders.length === 0 && (
                  <p className="text-xs text-center py-8" style={{ color: '#B58B67' }}>Empty</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}