import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/features/orders/ordersApi'
import { upsertOrder } from '@/features/orders/ordersSlice'
import { selectActiveOrders } from '@/features/orders/ordersSelectors'
import { socketActions } from '@/features/socket/socketMiddleware'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const BRANCH_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' // TODO: from logged-in staff's branch later

// Defines what button to show for each current status,
// and what status clicking it moves the order to
const NEXT_STATUS: Record<string, { label: string; next: string } | null> = {
  pending:    { label: 'Confirm order',   next: 'confirmed' },
  confirmed:  { label: 'Start preparing', next: 'in_kitchen' },
  in_kitchen: { label: 'Mark ready',      next: 'ready' },
  ready:      { label: 'Mark completed',  next: 'completed' },
  completed:  null,
}

export default function KitchenDisplayPage() {
  const dispatch = useAppDispatch()

  // Step A — fetch whatever's already active via REST, once on load
  const { data: initialOrders } = useGetOrdersQuery()

  // Step B — read the live, socket-updated version from Redux
  const liveOrders = useAppSelector(selectActiveOrders)

  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()

  useEffect(() => {
    // Seed Redux with whatever the REST call found
    if (initialOrders) {
      initialOrders.forEach(o => dispatch(upsertOrder({
        id: o.id, orderNumber: o.orderNumber, status: o.status, branchId: o.branchId,
      })))
    }
    // Join the kitchen room for this branch — from now on,
    // new orders and status changes arrive live via socket
    dispatch(socketActions.joinKitchen(BRANCH_ID))
  }, [initialOrders, dispatch])

  const handleAdvance = async (orderId: string, nextStatus: string) => {
    try {
      await updateStatus({ orderId, status: nextStatus }).unwrap()
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Could not update order')
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Kitchen — Live orders</h1>

      {liveOrders.length === 0 && (
        <p style={{ color: '#B58B67' }}>No active orders right now.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveOrders.map((order) => {
          const action = NEXT_STATUS[order.status]

          return (
            <div key={order.id} className="border border-border rounded-xl p-4 bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-foreground">{order.orderNumber}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary capitalize">
                  {order.status.replace('_', ' ')}
                </span>
              </div>

              {action && (
                <Button
                  className="w-full mt-3"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => handleAdvance(order.id, action.next)}
                >
                  {action.label}
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}