import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/features/orders/ordersApi'
import { upsertOrder } from '@/features/orders/ordersSlice'
import { selectActiveOrders } from '@/features/orders/ordersSelectors'
import { socketActions } from '@/features/socket/socketMiddleware'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

const COLUMNS = [
  { status: 'pending',    title: 'New',       accent: 'border-l-primary' },
  { status: 'confirmed',  title: 'Confirmed', accent: 'border-l-blue-500' },
  { status: 'in_kitchen', title: 'Preparing', accent: 'border-l-amber-500' },
  { status: 'ready',      title: 'Ready',     accent: 'border-l-green-500' },
]

const NEXT_STATUS: Record<string, { label: string; next: string }> = {
  pending:    { label: 'Confirm',   next: 'confirmed' },
  confirmed:  { label: 'Start prep', next: 'in_kitchen' },
  in_kitchen: { label: 'Mark ready', next: 'ready' },
  ready:      { label: 'Complete',   next: 'completed' },
}

// Live-updating "time since order arrived" — ticks every second
function useElapsed(createdAt?: string) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!createdAt) return
    const start = new Date(createdAt).getTime()
    const tick = () => setSeconds(Math.floor((Date.now() - start) / 1000))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [createdAt])
  return seconds
}

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function KitchenDisplayPage() {
  const dispatch = useAppDispatch()
  const { data: initialOrders } = useGetOrdersQuery()
  const liveOrders = useAppSelector(selectActiveOrders)
  const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation()

  useEffect(() => {
    if (initialOrders) {
      initialOrders.forEach(o => dispatch(upsertOrder({
        id: o.id, orderNumber: o.orderNumber, status: o.status, branchId: o.branchId,
      })))
    }
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Kitchen</h1>
        <span className="text-xs text-muted-foreground">
          {liveOrders.length} active order{liveOrders.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const ordersInColumn = liveOrders.filter(o => o.status === col.status)

          return (
            <div key={col.status} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <h2 className="text-sm font-semibold text-foreground">{col.title}</h2>
                <span className="text-xs text-muted-foreground">{ordersInColumn.length}</span>
              </div>

              <div className="space-y-3 min-h-[120px]">
                {ordersInColumn.map((order) => (
                  <OrderTicket
                    key={order.id}
                    order={order}
                    accent={col.accent}
                    action={NEXT_STATUS[order.status]}
                    disabled={isLoading}
                    onAdvance={handleAdvance}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OrderTicket({ order, accent, action, disabled, onAdvance }: any) {
  const elapsed = useElapsed(order.createdAt ?? new Date().toISOString())
  const isUrgent = elapsed > 600 // over 10 minutes waiting

  return (
    <div
      className={cn(
        'rounded-xl border-l-4 border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300',
        accent
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-foreground text-lg">{order.orderNumber}</span>
        <span className={cn(
          'text-xs font-mono px-2 py-0.5 rounded-full',
          isUrgent ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-muted-foreground'
        )}>
          {formatElapsed(elapsed)}
        </span>
      </div>

      {action && (
        <button
          disabled={disabled}
          onClick={() => onAdvance(order.id, action.next)}
          className="w-full mt-2 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}