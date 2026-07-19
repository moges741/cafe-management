"use client";

import { useState } from 'react'
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/features/orders/ordersApi'
import type { Order } from '@/features/orders/ordersApi'
import { format } from 'date-fns'
import {
  Search, Clock, CheckCircle, ChefHat, Package,
  ChevronDown, Utensils, Coffee, XCircle, FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

// Premium Status configurations
const STATUS_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]', icon: Clock },
  preparing: { label: 'Preparing', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]', icon: ChefHat },
  ready: { label: 'Ready', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]', icon: Package },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]', icon: XCircle }
}

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
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
    <div className="min-h-screen bg-[#050301] relative overflow-hidden pb-20">
      
      {/* --- Ambient Background Glows --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-orange-950/15 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-8 relative z-10 pt-10">
        
        {/* ================= HEADER ================= */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <Sparkles size={12} className="animate-pulse" /> Live Kitchen
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Order Management</h1>
            <p className="text-sm mt-2 text-neutral-400 font-medium">
              Monitor, update, and fulfill customer requests in real-time.
            </p>
          </div>
          
          <div className="px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-4 shadow-xl">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Total Orders</span>
              <span className="text-xl font-black text-white leading-none">{orders.length}</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <FileText size={20} className="text-amber-400" />
            </div>
          </div>
        </motion.div>

        {/* ================= FILTERS & SEARCH ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col xl:flex-row gap-4 items-center bg-white/[0.02] backdrop-blur-2xl p-4 rounded-[24px] border border-white/10 shadow-xl"
        >
          <div className="relative w-full xl:w-96 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all shadow-inner"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 w-full xl:w-auto scrollbar-hide flex-nowrap custom-scrollbar">
            <FilterTab active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} label="All Orders" />
            <FilterTab active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} label="Pending" />
            <FilterTab active={statusFilter === 'preparing'} onClick={() => setStatusFilter('preparing')} label="Preparing" />
            <FilterTab active={statusFilter === 'ready'} onClick={() => setStatusFilter('ready')} label="Ready" />
            <FilterTab active={statusFilter === 'completed'} onClick={() => setStatusFilter('completed')} label="Completed" />
          </div>
        </motion.div>

        {/* ================= ORDERS LIST ================= */}
        <motion.div layout className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div 
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-28 bg-white/5 backdrop-blur-md rounded-[24px] animate-pulse border border-white/10" 
                />
              ))
            ) : sortedOrders.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="text-center py-20 bg-white/[0.02] rounded-[32px] border border-dashed border-white/10 backdrop-blur-sm"
              >
                <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <FileText size={32} className="text-neutral-600" />
                </div>
                <p className="text-xl font-bold text-white tracking-tight">No orders found</p>
                <p className="text-sm text-neutral-500 mt-2">Adjust your filters or wait for new orders to arrive.</p>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {sortedOrders.map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    isExpanded={expandedOrderId === order.id}
                    onToggleExpand={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

// ================= SUB-COMPONENTS =================

function FilterTab({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors duration-300",
        active ? "text-amber-400" : "text-neutral-400 hover:text-white hover:bg-white/5"
      )}
    >
      {active && (
        <motion.div
          layoutId="order-filter-active"
          className="absolute inset-0 bg-amber-500/10 border border-amber-500/30 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.1)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
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
    <motion.div 
      layout
      variants={itemVariants}
      className={cn(
        "bg-white/[0.02] backdrop-blur-xl rounded-[24px] border transition-all duration-300 overflow-hidden",
        isExpanded 
          ? "border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.05)] bg-white/[0.04]" 
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.03]"
      )}
    >
      {/* Header (Always visible) */}
      <div 
        className="p-5 sm:p-6 flex flex-col md:flex-row gap-5 md:items-center justify-between cursor-pointer group"
        onClick={onToggleExpand}
      >
        <div className="flex items-start sm:items-center gap-5">
          <div className={cn("p-4 rounded-2xl border flex-shrink-0 transition-transform group-hover:scale-105", config.color)}>
            <StatusIcon size={24} />
          </div>
          
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-extrabold text-lg text-white tracking-tight">
                Order #{order.orderNumber || order.id.slice(-6).toUpperCase()}
              </h3>
              <Badge variant="outline" className={cn("capitalize font-bold border px-3 py-0.5 shadow-sm text-xs", config.color)}>
                {config.label}
              </Badge>
              {order.type === 'dine_in' && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs px-2.5 py-0.5">
                  <Utensils size={12} className="mr-1.5 inline" /> Dine-in (T{order.tableNumber})
                </Badge>
              )}
              {order.type === 'takeaway' && (
                <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-xs px-2.5 py-0.5">
                  <Coffee size={12} className="mr-1.5 inline" /> Takeaway
                </Badge>
              )}
            </div>
            <p className="text-sm mt-1.5 text-neutral-400 flex items-center gap-2 font-medium">
              <Clock size={14} className="text-neutral-500" /> 
              {order.createdAt ? format(new Date(order.createdAt), 'MMM d, h:mm a') : 'Just now'}
              <span className="text-neutral-600">•</span>
              <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                {Number(order.totalAmount).toLocaleString()} ETB
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-[72px] md:ml-0">
          {nextStatus && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(order.id, nextStatus)
              }}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 flex items-center gap-2"
            >
              Mark {STATUS_CONFIG[nextStatus]?.label} <ArrowRight size={14} />
            </button>
          )}
          <div className={cn(
            "p-2.5 rounded-full border transition-all duration-300 text-neutral-400",
            isExpanded ? "bg-white/10 border-white/20 rotate-180" : "bg-white/5 border-white/10 group-hover:bg-white/10 group-hover:text-white"
          )}>
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 bg-black/40 p-5 sm:p-6 shadow-inner">
              <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
                
                {/* Items List */}
                <div>
                  <h4 className="text-[11px] font-bold text-neutral-500 mb-4 uppercase tracking-[0.15em]">Order Items</h4>
                  <div className="space-y-3">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-sm font-black text-amber-400 shadow-inner">
                              {item.quantity}x
                            </div>
                            <div>
                              <p className="font-bold text-white">{item.productName || item.product?.name || 'Unknown Product'}</p>
                              {item.notes && (
                                <p className="text-xs text-amber-400/80 font-medium mt-1 bg-amber-500/10 inline-block px-2 py-0.5 rounded border border-amber-500/20">
                                  Note: {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          {item.product?.price && (
                            <span className="text-sm font-extrabold text-white">
                              {(Number(item.product.price) * item.quantity).toLocaleString()} <span className="text-neutral-500 font-medium text-xs">ETB</span>
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-500 italic">No item details available.</p>
                    )}
                  </div>
                </div>

                {/* Summary Panel */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[11px] font-bold text-neutral-500 mb-4 uppercase tracking-[0.15em]">Order Info</h4>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4 text-sm shadow-inner">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400 font-medium">Customer</span>
                        <span className="font-bold text-white bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                          {order.customer?.email || 'Guest'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400 font-medium">Type</span>
                        <span className="font-bold text-white capitalize">
                          {order.type?.replace('_', ' ') || 'Unknown'}
                        </span>
                      </div>
                      {order.notes && (
                        <div className="pt-4 mt-2 border-t border-white/10">
                          <span className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-2">Special Instructions</span>
                          <span className="text-white font-medium bg-black/30 p-3 rounded-xl border border-white/5 block text-sm italic">
                            "{order.notes}"
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-5 rounded-2xl border border-amber-500/20">
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-neutral-300 uppercase tracking-widest text-xs">Total Amount</span>
                        <span className="font-black text-amber-400 text-2xl tracking-tight">
                          {Number(order.totalAmount).toLocaleString()} <span className="text-sm text-amber-500/50">ETB</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}