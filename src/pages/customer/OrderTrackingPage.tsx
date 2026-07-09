import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useGetOrderByIdQuery } from '@/features/orders/ordersApi'
import { upsertOrder } from '@/features/orders/ordersSlice'
import { socketActions } from '@/features/socket/socketMiddleware'
import { cn } from '@/lib/utils'

const STEPS = [
  { key: 'pending',    label: 'Order received' },
  { key: 'confirmed',  label: 'Confirmed' },
  { key: 'in_kitchen', label: 'Preparing' },
  { key: 'ready',      label: 'Ready' },
  { key: 'completed',  label: 'Completed' },
]

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  // Initial fetch via REST — gives us the starting state immediately
  const { data: order } = useGetOrderByIdQuery(id!)

  // Live state — this is what actually updates in real time via the socket
  const liveOrder = useAppSelector(state => state.orders.byId[id!])

  useEffect(() => {
    if (order) {
      // Seed Redux with the REST snapshot so we have something to show
      // before any socket event arrives
      dispatch(upsertOrder({
        id:          order.id,
        orderNumber: order.orderNumber,
        status:      order.status,
        branchId:    order.branchId,
      }))
      // Join this order's room — from now on, status changes push live
      dispatch(socketActions.joinOrderRoom(order.id))
    }
  }, [order, dispatch])

  const currentStatus = liveOrder?.status ?? order?.status
  const currentStepIndex = STEPS.findIndex(s => s.key === currentStatus)

  if (!order) {
    return <div className="min-h-screen bg-background p-8 text-foreground">Loading order...</div>
  }

  if (currentStatus === 'cancelled') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">This order was cancelled.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-md mx-auto">
        <Link to="/menu" className="text-sm text-primary">← Back to menu</Link>

        <h1 className="text-2xl font-bold text-foreground mt-4">
          Order {order.orderNumber}
        </h1>
        <p className="text-sm mt-1" style={{ color: '#B58B67' }}>
          Live updates — no need to refresh
        </p>

        <div className="mt-8 space-y-6">
          {STEPS.map((step, i) => {
            const isDone   = i <= currentStepIndex
            const isActive = i === currentStepIndex

            return (
              <div key={step.key} className="flex items-center gap-4">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 border-2 transition-colors',
                    isDone
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border text-muted-foreground'
                  )}
                >
                  {isDone ? '✓' : i + 1}
                </div>
                <span
                  className={cn(
                    'text-sm',
                    isActive ? 'text-primary font-medium' : isDone ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
                {isActive && (
                  <span className="ml-auto flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}