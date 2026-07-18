import { useState, useMemo } from 'react'
import { useGetProductsQuery } from '@/features/products/productsApi'
import { useGetCategoriesQuery } from '@/features/categories/categoriesApi'
import { MENU_TABS } from '@/features/categories/categoryFilters'
import { cn } from '@/lib/utils'
import CartBadge from '@/components/shared/CartBadge'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
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
    branchId:    BRANCH_ID,
    isAvailable: true,
  }) as { data?: Product[]; isLoading: boolean }

  // Resolve the active tab into a set of real category IDs
  const activeCategoryIds = useMemo(() => {
    const tab = MENU_TABS.find(t => t.key === activeTab)
    if (!tab || tab.matchNames.length === 0) return null // "All" → no filter

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
    <div className="min-h-screen bg-background">

        <div className="fixed top-0 right-0 z-50 p-4">
        <CartBadge />
        </div>
      {/* ── Hero header ── */}
      <div className="relative px-6 pt-10 pb-8 border-b border-border">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">
          Mr. Cafe
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground max-w-lg">
          Good food, honest coffee.
        </h1>
        <p className="mt-2 text-sm max-w-md" style={{ color: '#B58B67' }}>
          Fresh from our kitchen to your table — order online or through our AI assistant.
        </p>
      </div>

      {/* ── Sticky category tabs ── */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {MENU_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border',
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-foreground border-border hover:border-primary/50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="px-6 py-8">
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-card animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && visibleProducts.length === 0 && (
          <p className="text-center py-16" style={{ color: '#B58B67' }}>
            Nothing here yet — check another category.
          </p>
        )}

        {!isLoading && visibleProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/menu/${product.id}`}
        className="group relative block w-full aspect-[4/5] rounded-[32px] overflow-hidden border border-white/10 bg-neutral-900/50 backdrop-blur-md shadow-2xl transition-all duration-700 hover:border-amber-500/30"
      >
        {/* --- Image Layer --- */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="w-full h-full"
            whileHover={{ scale: 1.1, rotate: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-amber-500/20 text-6xl font-black">
                MC
              </div>
            )}
          </motion.div>
          
          {/* Subtle vignette for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
        </div>

        {/* --- Content Overlay --- */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500/80 mb-1">
                {product.category?.name || "Signature"}
              </p>
              <h3 className="text-xl font-bold text-white leading-tight tracking-tight">
                {product.name}
              </h3>
            </div>
            
            {/* Price Pill */}
            <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium text-sm">
              {Number(product.price).toFixed(0)} ETB
            </div>
          </div>

          {/* Quick Add Indicator - Appears on Hover */}
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            whileHover={{ opacity: 1, height: "auto" }}
            className="mt-4 flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center gap-2 text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> View Details
            </div>
            <div className="p-2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShoppingCart size={16} />
            </div>
          </motion.div>
        </div>

        {/* Premium Border Highlight Effect */}
        <div className="absolute inset-0 rounded-[32px] border border-white/[0.05] pointer-events-none group-hover:border-amber-500/20 transition-colors duration-500" />
      </Link>
    </motion.div>
  );
}