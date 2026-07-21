import { useState, useMemo } from 'react'
import { useGetProductsQuery } from '@/features/products/productsApi'
import { useGetCategoriesQuery } from '@/features/categories/categoriesApi'
import { MENU_TABS } from '@/features/categories/categoryFilters'
import { cn } from '@/lib/utils'
import CartBadge from '@/components/shared/CartBadge'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingCart, Coffee, Sparkles } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { SkeletonMenuCard } from '@/components/ui/Skeleton'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

type Product = {
  id: string
  name: string
  price: string | number
  imageUrl?: string | null
  categoryId?: string | null
  category?: {
    name?: string | null
  } | null
}

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('all')

  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: products = [], isLoading } = useGetProductsQuery({
    branchId: BRANCH_ID,
    isAvailable: true,
  }) as { data?: Product[]; isLoading: boolean }

  // Resolve the active tab into a set of real category IDs
  const activeCategoryIds = useMemo(() => {
    const tab = MENU_TABS.find(t => t.key === activeTab)
    if (!tab || tab.matchNames.length === 0) return null

    return categories
      .filter(c =>
        tab.matchNames.some(name =>
          c.name.toLowerCase().includes(name)
        )
      )
      .map(c => c.id)
  }, [activeTab, categories])

  const visibleProducts = activeCategoryIds
    ? products.filter(
        (p): p is Product & { categoryId: string } =>
          typeof p.categoryId === 'string' && activeCategoryIds.includes(p.categoryId)
      )
    : products

  return (
    <div className="min-h-screen bg-[#050301] selection:bg-amber-500/30 relative overflow-hidden pb-24">
      
      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-orange-950/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Top Navigation / Cart */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-end pointer-events-none">
        <div className="pointer-events-auto">

        </div>
      </div>

      {/* ── Hero header ── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative px-6 pt-24 pb-12 max-w-7xl mx-auto z-10"
      >
        <div className="inline-flex mt-4 items-center justify-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Coffee size={12} className="fill-amber-500" /> Artisan Menu
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white max-w-2xl leading-[1.1] tracking-tight">
          Good food, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
            honest coffee.
          </span>
        </h1>
        <p className="mt-4 text-lg text-neutral-400 max-w-md font-medium">
          Fresh from our kitchen to your table. Order online or chat with our AI assistant.
        </p>
      </motion.div>

      {/* ── Sticky category tabs ── */}
      <div className="sticky top-0 z-40 bg-[#050301]/80 backdrop-blur-xl border-y border-white/5 shadow-2xl shadow-black/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mb-2 items-center">
            {MENU_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'shrink-0 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 border',
                    isActive
                      ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105'
                      : 'bg-white/[0.02] text-neutral-400 border-white/10 hover:border-amber-500/30 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonMenuCard key={i} />
            ))}
          </div>
        )}

        {!isLoading && visibleProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-neutral-500 mb-6">
              <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nothing here right now</h3>
            <p className="text-neutral-400 font-medium">Try selecting a different category to explore more items.</p>
          </motion.div>
        )}

        {!isLoading && visibleProducts.length > 0 && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            } as any}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
      } as any}
      viewport={{ once: true }}
    >
      <Link
        to={`/menu/${product.id}`}
        className="group relative block w-full aspect-[4/5] rounded-[32px] overflow-hidden border border-white/10 bg-[#110a05] backdrop-blur-md shadow-2xl transition-all duration-700 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
      >
        {/* --- Image Layer --- */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="w-full h-full"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black text-amber-500/10 text-7xl font-black">
                MC
              </div>
            )}
          </motion.div>
          
          {/* Subtle vignette for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050301] via-[#050301]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
        </div>

        {/* --- Content Overlay --- */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-end justify-between">
            <div className="pr-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 mb-2">
                {product.category?.name || "Signature"}
              </p>
              <h3 className="text-xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                {product.name}
              </h3>
            </div>
            
            {/* Price Pill */}
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold text-sm shadow-xl shrink-0">
              {Number(product.price).toFixed(0)} ETB
            </div>
          </div>

          {/* Quick Add Indicator - Appears on Hover */}
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            whileHover={{ opacity: 1, height: "auto" }}
            className="mt-5 flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center gap-2 text-[10px] text-neutral-300 uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> View Details
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <ShoppingCart size={16} className="fill-black" />
            </div>
          </motion.div>
        </div>

        {/* Premium Border Highlight Effect */}
        <div className="absolute inset-0 rounded-[32px] border border-white/[0.05] pointer-events-none group-hover:border-amber-500/20 transition-colors duration-500" />
      </Link>
    </motion.div>
  )
}