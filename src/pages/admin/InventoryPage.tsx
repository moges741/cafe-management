import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useGetInventoryQuery, useAdjustInventoryMutation } from '@/features/inventory/inventoryApi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function InventoryPage() {
  const { data: items = [], isLoading } = useGetInventoryQuery()
  const [adjust] = useAdjustInventoryMutation()
  const [adjustingId, setAdjustingId] = useState<string | null>(null)

  const handleAdjust = async (id: string, delta: number) => {
    setAdjustingId(id)
    try {
      await adjust({ id, quantity: delta, reason: delta > 0 ? 'restock' : 'manual_deduction' }).unwrap()
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Adjustment failed')
    } finally {
      setAdjustingId(null)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Inventory</h1>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-card animate-pulse" />)}
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => {
          const isLow = item.quantity <= item.lowStockThreshold

          return (
            <div
              key={item.id}
              className={cn(
                'flex items-center justify-between rounded-xl border p-4',
                isLow ? 'border-destructive/40 bg-destructive/5' : 'border-border bg-card'
              )}
            >
              <div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs mt-0.5" style={{ color: isLow ? undefined : '#B58B67' }}>
                  <span className={isLow ? 'text-destructive' : ''}>
                    {item.quantity} {item.unit}
                  </span>
                  {isLow && ' — low stock'}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleAdjust(item.id, -1)}
                  disabled={adjustingId === item.id}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-secondary"
                  aria-label={`Decrease ${item.name}`}
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => handleAdjust(item.id, 1)}
                  disabled={adjustingId === item.id}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-secondary"
                  aria-label={`Increase ${item.name}`}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}