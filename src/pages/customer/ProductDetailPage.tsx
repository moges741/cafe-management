import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Minus, Plus, ShoppingBag, Coffee, Sparkles } from 'lucide-react'
import { useGetProductByIdQuery } from '@/features/products/productsApi'
import { useAppDispatch } from '@/app/hooks'
import { addItem, setBranch } from '@/features/cart/cartSlice'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'

// Framer Motion Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading } = useGetProductByIdQuery(id!)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  const allImages = product
    ? [
        ...(product.imageUrl ? [{ id: 'primary', url: product.imageUrl, position: -1 }] : []),
        ...(product.images ?? []).filter(img => img.url !== product.imageUrl).sort((a, b) => a.position - b.position),
      ]
    : []

  const handleAddToCart = () => {
    dispatch(setBranch(product!.branchId))
    dispatch(addItem({
      productId: product!.id,
      productName: product!.name,
      quantity,
      unitPrice: Number(product!.price),
      notes: notes || undefined,
    }))
    
    toast.success(`${quantity}x ${product!.name} added to cart`, {
      icon: '🛍️',
      style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(245, 158, 11, 0.2)' }
    })
    navigate('/cart')
  }

  // ── LOADING STATE ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050301] px-6 py-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-amber-500">
          <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <p className="font-medium tracking-widest uppercase text-sm">Brewing details...</p>
        </div>
      </div>
    )
  }

  // ── NOT FOUND STATE ──
  if (!product) {
    return (
      <div className="min-h-screen bg-[#050301] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-neutral-500 mb-6">
          <Coffee size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Item not found</h2>
        <p className="text-neutral-400 mb-8">This item might have been removed or is currently unavailable.</p>
        <Link to="/menu">
          <Button className="bg-amber-500 text-black hover:bg-amber-400 font-bold rounded-xl px-8 h-12">
            Back to Menu
          </Button>
        </Link>
      </div>
    )
  }

  const totalPrice = (Number(product.price) * quantity).toFixed(0)

  return (
    <div className="min-h-screen bg-[#050301] selection:bg-amber-500/30 relative overflow-hidden pb-24">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-900/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-orange-950/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-[#050301]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
         <Navbar/>
        </div>
      </div>

      <div className="max-w-6xl mt-20 mx-auto px-6 py-8 md:py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start">
          
          {/* ── LEFT COLUMN: IMAGE GALLERY ── */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-4 sticky top-24"
          >
            {/* Main Image */}
            <div className="aspect-square w-full rounded-[32px] overflow-hidden bg-[#110a05] border border-white/10 shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
              <AnimatePresence mode="wait">
                {allImages.length > 0 ? (
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={allImages[activeImage].url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-500/10 text-8xl font-black">
                    MC
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      'w-20 h-20 rounded-2xl overflow-hidden shrink-0 transition-all duration-300 relative',
                      activeImage === i 
                        ? 'border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] opacity-100 scale-105' 
                        : 'border border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
                    )}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {activeImage === i && <div className="absolute inset-0 bg-amber-500/10" />}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── RIGHT COLUMN: PRODUCT DETAILS ── */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Header Info */}
            <motion.div variants={fadeUp} className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <Sparkles size={12} className="fill-amber-500" /> 
                {product.category?.name || "Signature"}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                {product.name}
              </h1>
              <div className="inline-block px-5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-2xl shadow-xl">
                {Number(product.price).toFixed(0)} ETB
              </div>
            </motion.div>

            {/* Description */}
            {product.description && (
              <motion.div variants={fadeUp} className="mb-10">
                <p className="text-neutral-400 font-medium leading-relaxed text-lg">
                  {product.description}
                </p>
              </motion.div>
            )}

            <motion.div variants={fadeUp} className="space-y-8 bg-white/[0.02] border border-white/5 rounded-[32px] p-6 md:p-8 backdrop-blur-xl">
              
              {/* Quantity Stepper */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
                  Quantity
                </span>
                <div className="flex items-center bg-black/60 border border-white/10 rounded-full p-1.5 shadow-inner w-fit">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center text-xl font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Notes Textarea */}
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase tracking-widest text-neutral-400 block">
                  Special Instructions
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra hot, no sugar, oat milk..."
                  rows={3}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none shadow-inner"
                />
              </div>

              {/* Add to Cart Button */}
              <Button 
                onClick={handleAddToCart}
                className="w-full h-16 bg-amber-500 hover:bg-amber-400 text-black text-lg font-bold rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-3 group mt-4"
              >
                <ShoppingBag size={22} className="group-hover:-translate-y-1 transition-transform" />
                <span>Add to Order — {totalPrice} ETB</span>
              </Button>

            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}