import { useGetOrdersQuery } from '@/features/orders/ordersApi'
import { baseApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle, CreditCard, History, ChefHat, AlertCircle } from 'lucide-react'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import toast from 'react-hot-toast'
import { useMemo } from 'react'

export default function CashierPosPage() {
  const { branchId } = useCurrentBranch()
  const { data: allOrders = [], isLoading } = useGetOrdersQuery(
    { branchId: branchId || undefined },
    { pollingInterval: 5000, skip: !branchId }
  )

  const [confirmCash, { isLoading: isConfirming }] = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      confirmCash: builder.mutation<any, { orderId: string }>({
        query: (body) => ({ url: '/payments/cash-confirm', method: 'POST', body }),
        invalidatesTags: ['Order'],
      })
    })
  }).useConfirmCashMutation()

  const incomingPayments = useMemo(() => {
    // Only pending orders that are NOT paid
    return allOrders.filter(o => o.status === 'pending' && o.payment?.status !== 'completed')
  }, [allOrders])

  const paymentHistory = useMemo(() => {
    // Any order that has been paid, sorted by newest first
    return allOrders
      .filter(o => o.payment?.status === 'completed')
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
  }, [allOrders])

  const handleConfirmCash = async (orderId: string) => {
    try {
      await confirmCash({ orderId }).unwrap()
      toast.success('Cash payment confirmed')
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.error?.message || 'Could not confirm payment')
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-background p-6 text-foreground">Loading orders...</div>
  }

  return (
    <div className="min-h-screen bg-background p-6 overflow-y-auto space-y-12">
      
      {/* ── Section 1: Incoming Payments ── */}
      <div>
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
          <CreditCard size={24} className="text-amber-500" />
          <h2 className="text-2xl font-bold text-foreground">Incoming Payments</h2>
          <span className="ml-2 text-sm text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full font-bold">
            {incomingPayments.length} Awaiting
          </span>
        </div>

        {incomingPayments.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
            <ChefHat size={48} className="mb-4 opacity-20" />
            <p>No pending payments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {incomingPayments.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actions={
                  <Button 
                    className="w-full text-green-600 border-green-600/30 hover:bg-green-600/10" 
                    variant="outline"
                    onClick={() => handleConfirmCash(order.id)}
                    disabled={isConfirming}
                  >
                    <CheckCircle size={15} className="mr-2" />
                    Confirm Cash ({Number(order.totalAmount).toFixed(0)} ETB)
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Section 2: Payment History ── */}
      <div>
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
          <History size={24} className="text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Payment History</h2>
          <span className="ml-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-full font-bold">
            {paymentHistory.length} Paid
          </span>
        </div>

        {paymentHistory.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
            <History size={48} className="mb-4 opacity-20" />
            <p>No payment history yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paymentHistory.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actions={
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs text-muted-foreground text-center">
                      Payment secured via <span className="font-bold text-foreground uppercase">{order.payment?.method || 'Unknown'}</span>
                    </p>
                    <Button 
                      className="w-full opacity-50 cursor-not-allowed" 
                      variant="secondary"
                      disabled
                    >
                      <CheckCircle size={15} className="mr-2 text-green-500" />
                      Paid
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

// ── Reusable Order Card ──
function OrderCard({ order, actions }: { order: any, actions: React.ReactNode }) {
  return (
    <div className={`bg-card border ${order.type === 'takeaway' ? 'border-orange-500/50' : 'border-border'} rounded-xl flex flex-col overflow-hidden`}>
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
            order.payment?.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-600'
          }`}>
            {order.payment?.status === 'completed' ? 'Paid' : 'Unpaid'}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto max-h-40">
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

      <div className="p-4 border-t border-border bg-muted/10">
        {actions}
      </div>
    </div>
  )
}