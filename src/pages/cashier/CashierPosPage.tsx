import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useGetOrdersQuery } from '@/features/orders/ordersApi'
import { useConfirmCashPaymentMutation } from '@/features/payments/paymentsApi'
import { upsertOrder } from '@/features/orders/ordersSlice'
import { selectActiveOrders } from '@/features/orders/ordersSelectors'
import { socketActions } from '@/features/socket/socketMiddleware'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const BRANCH_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'

export default function CashierPosPage() {
  const dispatch = useAppDispatch()
  const { data: initialOrders } = useGetOrdersQuery()
  const liveOrders = useAppSelector(selectActiveOrders)

  const [confirmCash, { isLoading }] = useConfirmCashPaymentMutation()

  useEffect(() => {
    if (initialOrders) {
      initialOrders.forEach(o => dispatch(upsertOrder({
        id: o.id, orderNumber: o.orderNumber, status: o.status, branchId: o.branchId,
      })))
    }
    dispatch(socketActions.joinKitchen(BRANCH_ID)) // same room — cashier watches the same live feed
  }, [initialOrders, dispatch])

  const pendingOrders = liveOrders.filter(o => o.status === 'pending')

  const handleConfirmCash = async (orderId: string) => {
    try {
      await confirmCash({ orderId }).unwrap()
      toast.success('Cash payment confirmed')
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Could not confirm payment')
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Cashier — Pending payments</h1>

      {pendingOrders.length === 0 && (
        <p style={{ color: '#B58B67' }}>No orders awaiting payment.</p>
      )}

      <div className="space-y-3 max-w-md">
        {pendingOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between border border-border rounded-xl p-4 bg-card">
            <span className="font-medium text-foreground">{order.orderNumber}</span>
            <Button size="sm" disabled={isLoading} onClick={() => handleConfirmCash(order.id)}>
              Confirm cash paid
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}