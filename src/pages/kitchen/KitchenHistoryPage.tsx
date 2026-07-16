import { useGetOrdersQuery } from '@/features/orders/ordersApi'
import { Clock } from 'lucide-react'
import { useMemo } from 'react'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

export default function KitchenHistoryPage() {
  // Fetch orders from the last 10 days
  const { data: allOrders = [], isLoading } = useGetOrdersQuery(
    { branchId: BRANCH_ID, days: 10 },
    { pollingInterval: 10000 }
  )

  const historyOrders = useMemo(() => {
    return allOrders.filter(o => o.status === 'completed')
  }, [allOrders])

  if (isLoading) {
    return <div className="p-6 text-foreground">Loading kitchen history...</div>
  }

  if (historyOrders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>No completed orders in the last 10 days</p>
      </div>
    )
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Completed Orders</h2>
        <p className="text-sm text-muted-foreground">Showing history for the last 10 days.</p>
      </div>

      <div className="overflow-x-auto border border-border rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Order</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Time Completed</th>
              <th className="px-6 py-4 font-medium">Items</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {historyOrders.map(order => (
              <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{order.orderNumber}</div>
                </td>
                <td className="px-6 py-4 text-foreground">
                  {order.type === 'dine_in' ? `Table ${order.tableNumber}` : 'Takeaway'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-foreground">
                    <Clock size={14} className="text-muted-foreground" />
                    {new Date(order.updatedAt || order.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <span className="text-xs text-muted-foreground ml-2">
                      ({new Date(order.updatedAt || order.createdAt!).toLocaleDateString()})
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <ul className="text-xs space-y-1 text-foreground">
                    {order.items?.map((item: any, idx: number) => (
                      <li key={idx}>
                        <span className="font-bold text-primary mr-1">{item.quantity}x</span> 
                        {item.product?.name || item.productName || 'Item'}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
