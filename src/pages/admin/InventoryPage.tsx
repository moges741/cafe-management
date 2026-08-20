import { useState, useMemo } from 'react'
import { Plus, Minus, Search, AlertCircle, TrendingDown, Box, CheckCircle2, WifiOff } from 'lucide-react'
import { useAdjustInventoryMutation } from '@/features/inventory/inventoryApi'
import type { InventoryItem } from '@/features/inventory/inventoryApi'  
import { usePwaInventory } from '@/hooks/usePwaInventory'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

import { useCurrentBranch } from '@/hooks/useCurrentBranch'

export default function InventoryPage() {
  const { branchId } = useCurrentBranch()
  const { items, isLoading, isOnline } = usePwaInventory({ branchId: branchId || undefined }, { skip: !branchId })
  const [adjust] = useAdjustInventoryMutation()
  const [adjustingId, setAdjustingId] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'low'>('all')

  const handleAdjust = async (id: string, delta: number) => {
    if (!navigator.onLine) {
      toast.error('Network offline: Internet connection is required to adjust stock levels.', {
        icon: '📡',
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
      })
      return
    }

    setAdjustingId(id)
    try {
      await adjust({ id, delta, reason: delta > 0 ? 'manual_addition' : 'manual_removal' }).unwrap()
      toast.success(delta > 0 ? 'Stock increased' : 'Stock decreased')
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Adjustment failed')
    } finally {
      setAdjustingId(null)
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      const isLowStock = item.quantity <= item.lowStockThreshold
      const matchesFilter = filter === 'all' || (filter === 'low' && isLowStock)
      return matchesSearch && matchesFilter
    })
  }, [items, searchTerm, filter])

  const lowStockCount = items.filter(i => i.quantity <= i.lowStockThreshold).length

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {!isOnline && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs md:text-sm flex items-center gap-3 shadow-md">
          <WifiOff size={18} className="shrink-0 text-amber-400 animate-pulse" />
          <div>
            <span className="font-bold">Offline Mode (Cached Inventory View):</span> Stock levels displayed may be stale. Internet connection is required to adjust stock quantities or restock.
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-sm mt-1" style={{ color: '#B58B67' }}>
            Monitor stock levels, adjust quantities, and manage low stock alerts.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-card px-4 py-3 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 pr-4 border-r border-border">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Box size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Items</p>
              <p className="text-lg font-bold text-foreground">{items.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-xl text-destructive">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Low Stock</p>
              <p className="text-lg font-bold text-destructive">{lowStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search inventory items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
              filter === 'all' 
                ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                : "bg-background text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
            )}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter('low')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-2",
              filter === 'low' 
                ? "bg-destructive text-destructive-foreground border-destructive shadow-sm" 
                : "bg-background text-muted-foreground border-border hover:border-destructive/30 hover:text-destructive"
            )}
          >
            Low Stock Only
            {lowStockCount > 0 && filter !== 'low' && (
              <span className="bg-destructive text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {lowStockCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-card animate-pulse border border-border" />
          ))
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border shadow-sm">
            <Box className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-foreground">No items found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === 'low' ? "Great! You don't have any items low on stock." : "Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredItems.map((item) => (
              <InventoryCard 
                key={item.id} 
                item={item} 
                isAdjusting={adjustingId === item.id}
                onAdjust={handleAdjust} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function InventoryCard({ 
  item, 
  isAdjusting, 
  onAdjust 
}: { 
  item: InventoryItem
  isAdjusting: boolean
  onAdjust: (id: string, delta: number) => void 
}) {
  const isLow = item.quantity <= item.lowStockThreshold
  const ratio = Math.min(100, (item.quantity / (item.lowStockThreshold * 2 || 1)) * 100)
  
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md",
      isLow 
        ? "bg-destructive/5 border-destructive/30 hover:border-destructive/60" 
        : "bg-card border-border hover:border-primary/40"
    )}>
      {/* Item Info */}
      <div className="flex-1 min-w-0 flex items-center gap-4 mb-4 sm:mb-0">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
          isLow ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-primary/10 text-primary border-primary/20"
        )}>
          {isLow ? <TrendingDown size={24} /> : <CheckCircle2 size={24} />}
        </div>
        
        <div className="min-w-0 pr-4">
          <h3 className="text-base font-bold text-foreground truncate">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-sm font-medium">
              {item.quantity} <span className="text-muted-foreground text-xs">{item.unit}</span>
            </span>
            <span className="text-border text-xs">•</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              Threshold: {item.lowStockThreshold}
            </span>
            {isLow && (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 px-1.5 py-0 text-[10px] ml-1">
                Low Stock
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Visual Indicator & Controls */}
      <div className="flex items-center gap-6 sm:w-1/2 justify-between sm:justify-end">
        {/* Progress Bar */}
        <div className="hidden md:flex flex-col w-32 shrink-0">
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-500", isLow ? "bg-destructive" : "bg-primary")} 
              style={{ width: `${ratio}%` }}
            />
          </div>
        </div>

        {/* Quick Adjust */}
        <div className="flex items-center gap-2 bg-background p-1.5 rounded-xl border border-border">
          <button
            onClick={() => onAdjust(item.id, -1)}
            disabled={isAdjusting}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50 transition-colors"
            title="Deduct 1 unit"
          >
            <Minus size={16} />
          </button>
          
          <div className="w-12 text-center font-bold text-sm">
            {item.quantity}
          </div>
          
          <button
            onClick={() => onAdjust(item.id, 1)}
            disabled={isAdjusting}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary disabled:opacity-50 transition-colors"
            title="Add 1 unit"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}