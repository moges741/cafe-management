import { useGetOrdersQuery } from '@/features/orders/ordersApi'
import { baseApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle, CreditCard, History, ChefHat, AlertCircle } from 'lucide-react'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import toast from 'react-hot-toast'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

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
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-4 md:p-6 text-muted-foreground">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium animate-pulse">Loading terminal...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-background p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto space-y-8 md:space-y-12">
      
      {/* ── Section 1: Incoming Payments ── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-amber-500 shrink-0" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Incoming Payments</h2>
          </div>
          <span className="inline-flex items-center justify-center w-max text-xs md:text-sm text-amber-600 bg-amber-500/10 px-3 py-1 md:px-4 md:py-1.5 rounded-full font-bold">
            {incomingPayments.length} Awaiting
          </span>
        </div>

        {incomingPayments.length === 0 ? (
          <div className="py-10 md:py-16 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/5">
            <ChefHat className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 opacity-20" />
            <p className="text-sm md:text-base font-medium">No pending payments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5">
            {incomingPayments.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actions={
                  <Button 
                    className="w-full h-12 md:h-10 text-sm font-bold text-green-600 border-green-600/30 hover:bg-green-600/10 active:scale-[0.98] transition-transform" 
                    variant="outline"
                    onClick={() => handleConfirmCash(order.id)}
                    disabled={isConfirming}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Cash ({Number(order.totalAmount).toFixed(0)} ETB)
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Section 2: Payment History ── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Payment History</h2>
          </div>
          <span className="inline-flex items-center justify-center w-max text-xs md:text-sm text-primary bg-primary/10 px-3 py-1 md:px-4 md:py-1.5 rounded-full font-bold">
            {paymentHistory.length} Paid
          </span>
        </div>

        {paymentHistory.length === 0 ? (
          <div className="py-10 md:py-16 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/5">
            <History className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 opacity-20" />
            <p className="text-sm md:text-base font-medium">No payment history yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5">
            {paymentHistory.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actions={
                  <div className="flex flex-col space-y-2">
                    <p className="text-[11px] md:text-xs text-muted-foreground text-center">
                      Secured via <span className="font-bold text-foreground uppercase">{order.payment?.method || 'Unknown'}</span>
                    </p>
                    <Button 
                      className="w-full h-11 md:h-10 opacity-60 cursor-not-allowed text-sm font-bold" 
                      variant="secondary"
                      disabled
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Paid
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}

// ── Reusable Order Card ──
function OrderCard({ order, actions }: { order: any, actions: React.ReactNode }) {
  const isTakeaway = order.type === 'takeaway'

  return (
    <div className={cn(
      "bg-card border rounded-2xl flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow",
      isTakeaway ? 'border-orange-500/40' : 'border-border'
    )}>
      {/* Card Header */}
      <div className={cn(
        "p-3 md:p-4 border-b border-border",
        isTakeaway ? 'bg-orange-500/10' : 'bg-muted/30'
      )}>
        <div className="flex justify-between items-start mb-2.5">
          <div>
            <h3 className="text-base md:text-lg font-black tracking-tight text-foreground leading-none">
              {order.orderNumber}
            </h3>
            <p className="text-[11px] md:text-xs font-medium text-muted-foreground flex items-center gap-1.5 mt-1.5">
              <Clock className="w-3 h-3" />
              {new Date(order.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm md:text-base font-black text-primary block leading-none">
              {Number(order.totalAmount).toFixed(0)} ETB
            </span>
            <div className={cn(
              "text-[10px] md:text-[11px] uppercase tracking-widest mt-1.5 font-bold",
              isTakeaway ? 'text-orange-500' : 'text-foreground'
            )}>
              {isTakeaway ? 'Takeaway' : `Table ${order.tableNumber || '?'}`}
            </div>
          </div>
        </div>

        {order.customer && (
          <p className="text-xs text-foreground mt-2 font-medium truncate">
            <span className="opacity-50 mr-1">👤</span> {order.customer.email}
          </p>
        )}
        
        <div className="mt-3 flex gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
          <span className={cn(
            "px-2.5 py-1 rounded-md",
            order.payment?.status === 'completed' 
              ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
              : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
          )}>
            {order.payment?.status === 'completed' ? 'Paid' : 'Unpaid'}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="p-3 md:p-4 flex-1 overflow-y-auto max-h-[180px] md:max-h-[160px] custom-scrollbar">
        <ul className="space-y-3">
          {order.items?.map((item: any, idx: number) => (
            <li key={idx} className="text-xs md:text-sm">
              <div className="flex items-start leading-snug">
                <span className="font-bold text-primary mr-2 shrink-0">{item.quantity}x</span>
                <span className="font-medium text-foreground">
                  {item.product?.name || item.productName || 'Unknown product'}
                </span>
              </div>
              {item.notes && (
                <p className="text-[11px] md:text-xs text-muted-foreground mt-1 flex gap-1.5 items-start bg-muted/50 p-1.5 rounded-md">
                  <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                  <span className="italic">{item.notes}</span>
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Footer */}
      <div className="p-3 md:p-4 border-t border-border bg-muted/10 shrink-0">
        {actions}
      </div>
    </div>
  )
}