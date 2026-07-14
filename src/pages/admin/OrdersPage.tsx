import { useState } from 'react'
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/features/orders/ordersApi'
import type { Order } from '@/features/orders/ordersApi'
import { format } from 'date-fns'
import {
  Search, Clock, CheckCircle, ChefHat, Package,
  ChevronDown, ChevronUp, Utensils, Coffee, XCircle, FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

// Status configurations
const STATUS_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Clock },
  preparing: { label: 'Preparing', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: ChefHat },
  ready: { label: 'Ready', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: Package },
  cancelled: { label: 'Cancelled', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle }
}

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useGetOrdersQuery()
  const [updateStatus] = useUpdateOrderStatusMutation()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ orderId, status: newStatus }).unwrap()
      toast.success(`Order marked as ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort by date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-sm" style={{ color: '#B58B67' }}>Manage and track customer orders in real-time.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-2xl border border-border">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          <FilterTab active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} label="All Orders" />
          <FilterTab active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} label="Pending" />
          <FilterTab active={statusFilter === 'preparing'} onClick={() => setStatusFilter('preparing')} label="Preparing" />
          <FilterTab active={statusFilter === 'ready'} onClick={() => setStatusFilter('ready')} label="Ready" />
          <FilterTab active={statusFilter === 'completed'} onClick={() => setStatusFilter('completed')} label="Completed" />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-card rounded-2xl animate-pulse border border-border" />
          ))
        ) : sortedOrders.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-lg font-medium text-foreground">No orders found</p>
            <p className="text-sm text-muted-foreground">Adjust your filters or wait for new orders to arrive.</p>
          </div>
        ) : (
          sortedOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              isExpanded={expandedOrderId === order.id}
              onToggleExpand={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  )
}

function FilterTab({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
        active 
          ? "bg-primary/10 text-primary border-primary/20" 
          : "bg-background text-muted-foreground border-transparent hover:border-border hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}

function OrderCard({ 
  order, 
  isExpanded, 
  onToggleExpand,
  onUpdateStatus 
}: { 
  order: Order
  isExpanded: boolean
  onToggleExpand: () => void
  onUpdateStatus: (id: string, status: string) => void 
}) {
  const config = STATUS_CONFIG[order.status.toLowerCase()] || STATUS_CONFIG['pending']
  const StatusIcon = config.icon

  // Determine next logical status
  let nextStatus = ''
  if (order.status === 'pending') nextStatus = 'preparing'
  else if (order.status === 'preparing') nextStatus = 'ready'
  else if (order.status === 'ready') nextStatus = 'completed'

  return (
    <div className={cn(
      "bg-card rounded-2xl border transition-all overflow-hidden",
      isExpanded ? "border-primary/30 shadow-sm" : "border-border hover:border-border/80"
    )}>
      {/* Header (Always visible) */}
      <div 
        className="p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-full border", config.color.split(' ')[0], config.color.split(' ')[2])}>
            <StatusIcon size={20} className={config.color.split(' ')[1]} />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground">Order #{order.orderNumber || order.id.slice(-6).toUpperCase()}</h3>
              <Badge variant="outline" className={cn("capitalize font-semibold border", config.color)}>
                {config.label}
              </Badge>
              {order.type === 'dine_in' && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  <Utensils size={12} className="mr-1 inline" /> Dine-in (Table {order.tableNumber})
                </Badge>
              )}
              {order.type === 'takeaway' && (
                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                  <Coffee size={12} className="mr-1 inline" /> Takeaway
                </Badge>
              )}
            </div>
            <p className="text-sm mt-1 text-muted-foreground flex items-center gap-2">
              <Clock size={14} /> 
              {order.createdAt ? format(new Date(order.createdAt), 'MMM d, h:mm a') : 'Just now'}
              <span className="text-border">•</span>
              <span className="font-medium text-foreground">{Number(order.totalAmount).toLocaleString()} ETB</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-16 md:ml-0">
          {nextStatus && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(order.id, nextStatus)
              }}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            >
              Mark as {STATUS_CONFIG[nextStatus]?.label}
            </button>
          )}
          <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border bg-background/50 p-5">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Order Items</h4>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-card p-3 rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.productName || item.product?.name || 'Unknown Product'}</p>
                          {item.notes && <p className="text-xs text-muted-foreground italic">Note: {item.notes}</p>}
                        </div>
                      </div>
                      {item.product?.price && (
                        <span className="text-sm font-medium">
                          {(Number(item.product.price) * item.quantity).toLocaleString()} ETB
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No item details available.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Order Info</h4>
                <div className="bg-card p-4 rounded-xl border border-border space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium text-foreground">{order.customer?.email || 'Guest'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-foreground capitalize">{order.type?.replace('_', ' ') || 'Unknown'}</span>
                  </div>
                  {order.notes && (
                    <div className="pt-3 mt-3 border-t border-border">
                      <span className="block text-muted-foreground mb-1">Special Instructions</span>
                      <span className="text-foreground">{order.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Summary</h4>
                <div className="bg-card p-4 rounded-xl border border-border">
                  <div className="flex justify-between items-center pt-2 border-t border-border mt-2 first:mt-0 first:border-0 first:pt-0">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-primary text-lg">{Number(order.totalAmount).toLocaleString()} ETB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
