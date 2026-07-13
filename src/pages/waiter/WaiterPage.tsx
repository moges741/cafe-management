import { useState, useMemo } from 'react'
import { Plus, Minus, Trash2, Send } from 'lucide-react'
import { useGetProductsQuery } from '@/features/products/productsApi'
import { useGetCategoriesQuery } from '@/features/categories/categoriesApi'
import { useCreateOrderMutation } from '@/features/orders/ordersApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

interface DraftItem {
  productId:   string
  productName: string
  quantity:    number
  unitPrice:   number
}

export default function WaiterPage() {
  const [tableNumber, setTableNumber] = useState('')
  const [draftItems, setDraftItems] = useState<DraftItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: products = [] } = useGetProductsQuery({ branchId: BRANCH_ID, isAvailable: true })
  const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation()

  const visibleProducts = activeCategory
    ? products.filter(p => p.categoryId === activeCategory)
    : products

  const total = useMemo(
    () => draftItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [draftItems]
  )

  const addProduct = (product: typeof products[number]) => {
    setDraftItems(prev => {
      const existing = prev.find(i => i.productId === product.id)
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, {
        productId:   product.id,
        productName: product.name,
        quantity:    1,
        unitPrice:   Number(product.price),
      }]
    })
  }

  const adjustQty = (productId: string, delta: number) => {
    setDraftItems(prev =>
      prev
        .map(i => i.productId === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter(i => i.quantity > 0)
    )
  }

  const removeItem = (productId: string) => {
    setDraftItems(prev => prev.filter(i => i.productId !== productId))
  }

  const handleSubmitOrder = async () => {
    if (!tableNumber.trim()) {
      toast.error('Enter a table number first')
      return
    }
    if (draftItems.length === 0) {
      toast.error('Add at least one item')
      return
    }

    try {
      const order = await createOrder({
        branchId:    BRANCH_ID,
        type:        'dine_in',
        tableNumber: Number(tableNumber),
        items: draftItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
      }).unwrap()

      toast.success(`Order ${order.orderNumber} sent to kitchen`)
      setDraftItems([])
      setTableNumber('')
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Could not submit order')
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Product picker ── */}
      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Take order</h1>
        </div>

        <div className="px-6 py-3 border-b border-border flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border',
              !activeCategory ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground'
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={cn(
                'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border',
                activeCategory === c.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground'
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {visibleProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addProduct(product)}
                className="text-left rounded-xl border border-border bg-card p-3 hover:border-primary/50 transition-colors"
              >
                <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                <p className="text-xs mt-1 text-primary">{Number(product.price).toFixed(0)} ETB</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Draft order panel ── */}
      <div className="w-80 border-l border-border flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <label className="text-xs" style={{ color: '#B58B67' }}>Table number</label>
          <Input
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="e.g. 4"
            type="number"
            className="mt-1"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {draftItems.length === 0 && (
            <p className="text-xs text-center py-8" style={{ color: '#B58B67' }}>
              Tap products to add
            </p>
          )}

          {draftItems.map((item) => (
            <div key={item.productId} className="flex items-center gap-2 border border-border rounded-lg p-2.5 bg-card">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{item.productName}</p>
                <p className="text-[11px] text-primary">{(item.unitPrice * item.quantity).toFixed(0)} ETB</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => adjustQty(item.productId, -1)} className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-foreground">
                  <Minus size={11} />
                </button>
                <span className="w-5 text-center text-xs text-foreground">{item.quantity}</span>
                <button onClick={() => adjustQty(item.productId, 1)} className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-foreground">
                  <Plus size={11} />
                </button>
                <button onClick={() => removeItem(item.productId)} className="w-6 h-6 flex items-center justify-center text-destructive">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-4 border-t border-border">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-foreground font-medium">Total</span>
            <span className="text-primary font-bold">{total.toFixed(0)} ETB</span>
          </div>
          <Button className="w-full" onClick={handleSubmitOrder} disabled={isSubmitting}>
            <Send size={14} className="mr-1.5" />
            {isSubmitting ? 'Sending...' : 'Send to kitchen'}
          </Button>
        </div>
      </div>
    </div>
  )
}