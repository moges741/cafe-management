import { useGetOrdersQuery } from '@/features/orders/ordersApi'
import { Clock } from 'lucide-react'
import { useMemo } from 'react'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

export default function WaiterHistoryPage() {
  const { data: allOrders = [], isLoading } = useGetOrdersQuery(
    { branchId: BRANCH_ID },
    { pollingInterval: 10000 }
  )

  const historyOrders = useMemo(() => {
    return allOrders.filter(o => ['in_kitchen', 'ready', 'completed'].includes(o.status))
  }, [allOrders])

  if (isLoading) {
    return <div className="p-6 text-foreground">Loading history...</div>
  }

  if (historyOrders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>No history available</p>
      </div>
    )
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="overflow-x-auto border border-border rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Order</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Time</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {historyOrders.map(order => (
              <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{order.orderNumber}</div>
                  {order.customer && <div className="text-xs text-muted-foreground mt-0.5">{order.customer.email}</div>}
                </td>
                <td className="px-6 py-4 text-foreground">
                  {order.type === 'dine_in' ? `Table ${order.tableNumber}` : 'Takeaway'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-foreground">
                    <Clock size={14} className="text-muted-foreground" />
                    {new Date(order.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider ${
                    order.status === 'in_kitchen' ? 'bg-orange-500/20 text-orange-500' :
                    order.status === 'ready' ? 'bg-primary/20 text-primary' :
                    'bg-green-500/20 text-green-500'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium text-foreground">
                  {Number(order.totalAmount).toFixed(0)} ETB
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
