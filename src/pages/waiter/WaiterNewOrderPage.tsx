import { useState, useMemo } from 'react'
import { Plus, Minus, Trash2, Send, LayoutGrid } from 'lucide-react'
import { useGetProductsQuery } from '@/features/products/productsApi'
import { useGetCategoriesQuery } from '@/features/categories/categoriesApi'
import { useCreateOrderMutation } from '@/features/orders/ordersApi'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import { motion, AnimatePresence } from 'framer-motion'

interface DraftItem {
  productId:   string
  productName: string
  quantity:    number
  unitPrice:   number
}

export default function WaiterNewOrderPage() {
  const { branchId } = useCurrentBranch()
  const [tableNumber, setTableNumber] = useState('')
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in')
  const [draftItems, setDraftItems] = useState<DraftItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const { data: categories = [] } = useGetCategoriesQuery({ branchId: branchId || undefined }, { skip: !branchId })
  const { data: products = [] } = useGetProductsQuery({ branchId: branchId || undefined, isAvailable: true }, { skip: !branchId })
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
    if (orderType === 'dine_in' && !tableNumber.trim()) {
      toast.error('Enter a table number first')
      return
    }
    if (draftItems.length === 0) {
      toast.error('Add at least one item')
      return
    }
    if (!branchId) {
      toast.error('No branch selected')
      return
    }

    try {
      const order = await createOrder({
        branchId,
        type:        orderType,
        tableNumber: orderType === 'dine_in' ? Number(tableNumber) : undefined,
        items: draftItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
      }).unwrap()

      toast.success(`Order #${order.orderNumber} created! Collect payment.`)
      setDraftItems([])
      setTableNumber('')
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Could not submit order')
    }
  }

  return (
    <div className="h-full flex flex-col md:flex-row bg-transparent overflow-hidden">
      
      {/* ── Left Pane: Product Catalog ── */}
      <div className="flex-1 flex flex-col h-[50vh] md:h-full border-b md:border-b-0 md:border-r border-white/10 relative">
        
        {/* Categories Header */}
        <div className="px-4 py-4 md:px-6 shrink-0 bg-[#050505] z-10 border-b border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Catalog</h2>
          </div>
          
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                'shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
                !activeCategory 
                  ? 'bg-[#ba7704] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                  : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
              )}
            >
              All Items
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
                  activeCategory === c.id 
                    ? 'bg-[#ba7704] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-black/20">
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            <AnimatePresence>
              {visibleProducts.map((product) => (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id}
                  onClick={() => addProduct(product)}
                  className="text-left relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 p-4 md:p-5 hover:bg-white/[0.05] hover:border-blue-500/50 transition-all group active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-sm md:text-base font-bold text-white mb-2 leading-tight">{product.name}</p>
                  <p className="text-xs font-black text-[#ba7704]">{Number(product.price).toFixed(0)} ETB</p>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ── Right Pane: Cart / Draft Order ── */}
      <div className="w-full md:w-[380px] h-[50vh] md:h-full bg-[#0a0a0a] flex flex-col shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20">
        
        {/* Order Config */}
        <div className="px-5 py-5 border-b border-white/10 bg-[#050505] shrink-0 space-y-4">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {(['dine_in', 'takeaway'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                  orderType === type
                    ? 'bg-[#ba7704] text-white shadow-md'
                    : 'text-neutral-500 hover:text-white'
                )}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>

          {orderType === 'dine_in' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="text-[10px] font-bold text-[#ba7704] uppercase tracking-widest block mb-1.5">Table Assignment</label>
              <input
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Table Number (e.g. 12)"
                type="number"
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </motion.div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
          {draftItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-600 opacity-50">
              <div className="w-12 h-12 border-2 border-dashed border-neutral-600 rounded-full mb-3" />
              <p className="text-xs font-bold uppercase tracking-widest">Cart is empty</p>
            </div>
          ) : (
            <AnimatePresence>
              {draftItems.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item.productId} 
                  className="flex items-center gap-3 p-3 bg-[#111] border border-white/10 rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{item.productName}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {item.unitPrice} × {item.quantity} = <span className="text-[#ba7704] font-bold">{(item.unitPrice * item.quantity).toFixed(0)} ETB</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0 bg-black/50 rounded-lg border border-white/5 p-1">
                    <button onClick={() => adjustQty(item.productId, -1)} className="w-7 h-7 rounded-md flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all">
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center text-xs font-bold text-white">{item.quantity}</span>
                    <button onClick={() => adjustQty(item.productId, 1)} className="w-7 h-7 rounded-md flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all">
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <button onClick={() => removeItem(item.productId)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20 shrink-0 transition-all">
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer / Checkout */}
        <div className="p-5 border-t border-white/10 bg-[#050505] shrink-0">
          <div className="flex justify-between items-end mb-4">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Total Amount</span>
            <span className="text-2xl font-black text-white">{total.toFixed(0)} <span className="text-blue-500 text-lg">ETB</span></span>
          </div>
          
          <button 
            className="w-full h-14 bg-[#ba7704] hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100" 
            onClick={handleSubmitOrder} 
            disabled={isSubmitting || draftItems.length === 0}
          >
            <Send size={18} />
            {isSubmitting ? 'Processing...' : 'Make Order'}
          </button>
        </div>
      </div>

    </div>
  )
}