import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/features/orders/ordersApi'
import { baseApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Clock, Send, ChefHat, AlertCircle, CheckCircle, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMemo } from 'react'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

export default function WaiterIncomingOrdersPage() {
  const { data: allOrders = [], isLoading } = useGetOrdersQuery(
    { branchId: BRANCH_ID },
    { pollingInterval: 5000 }
  )
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()
  const [confirmCash, { isLoading: isConfirming }] = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      confirmCash: builder.mutation<any, { orderId: string }>({
        query: (body) => ({ url: '/payments/cash-confirm', method: 'POST', body }),
        invalidatesTags: ['Order'],
      })
    })
  }).useConfirmCashMutation()

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

  const handleMarkAsPaid = async (order: any) => {
    try {
      await confirmCash({ orderId: order.id }).unwrap()
      toast.success('Marked as paid')
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.error?.message || 'Failed to confirm cash')
    }
  }

  if (isLoading) {
    return <div className="p-6 text-foreground">Loading orders...</div>
  }

  if (incomingOrders.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
        <ChefHat size={48} className="mb-4 opacity-20" />
        <p>No incoming orders</p>
      </div>
    )
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {incomingOrders.map((order) => (
          <div key={order.id} className={`bg-card border ${order.type === 'takeaway' ? 'border-orange-500/50' : 'border-border'} rounded-xl flex flex-col overflow-hidden`}>
            <div className={`p-4 border-b border-border ${order.type === 'takeaway' ? 'bg-orange-500/10' : 'bg-muted/20'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-foreground">{order.orderNumber}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(order.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-primary">{Number(order.totalAmount).toFixed(0)} ETB</span>
                  <div className={`text-xs uppercase tracking-wider mt-1 font-bold ${order.type === 'takeaway' ? 'text-orange-500' : 'text-foreground'}`}>
                    {order.type === 'dine_in' ? `Table ${order.tableNumber || '?'}` : 'Takeaway'}
                  </div>
                </div>
              </div>

              {order.customer && (
                <p className="text-xs text-foreground mt-2 font-medium">
                  👤 {order.customer.email}
                </p>
              )}
              
              <div className="mt-2 flex gap-2 text-[11px] font-medium uppercase tracking-wider">
                <span className={`px-2 py-0.5 rounded-full ${
                  order.payment?.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-destructive/20 text-destructive'
                }`}>
                  {order.payment?.status === 'completed' ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto max-h-60">
              <ul className="space-y-3">
                {order.items?.map((item: any, idx: number) => (
                  <li key={idx} className="text-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-foreground">
                        <span className="text-primary mr-2">{item.quantity}x</span>
                        {item.product?.name || item.productName || 'Unknown product'}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-xs text-muted-foreground mt-1 flex gap-1 items-start">
                        <AlertCircle size={12} className="shrink-0 mt-0.5" />
                        {item.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 border-t border-border bg-muted/10 space-y-2">
              {order.payment?.status !== 'completed' && (
                <Button 
                  variant="outline"
                  className="w-full text-green-600 border-green-600/30 hover:bg-green-600/10" 
                  onClick={() => handleMarkAsPaid(order)}
                  disabled={isConfirming || isUpdating}
                >
                  <CheckCircle size={15} className="mr-2" />
                  Mark as Paid (Cash)
                </Button>
              )}
              
              <Button 
                className="w-full" 
                onClick={() => handleSendToKitchen(order.id)}
                disabled={isUpdating || (order.payment?.status !== 'completed')}
              >
                <Send size={15} className="mr-2" />
                {order.payment?.status !== 'completed' ? 'Must be paid first' : 'Send to Kitchen'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
