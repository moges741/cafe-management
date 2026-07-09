import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useGetProductsQuery } from '@/features/products/productsApi'
import { useGetCategoriesQuery } from '@/features/categories/categoriesApi'
import { MENU_TABS } from '@/features/categories/categoryFilters'
import { cn } from '@/lib/utils'
import CartBadge from '@/components/shared/CartBadge'

const BRANCH_ID = 'cc058c8e-73a7-4357-82d9-03182feab651' // TODO: from branch context later

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

        <CartBadge />
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
    <Link
      to={`/menu/${product!.id}`}
      className="group relative rounded-2xl overflow-hidden border border-border bg-card block"
    >
      <div className="aspect-square w-full overflow-hidden bg-secondary">
        {product!.imageUrl ? (
          <img
            src={product!.imageUrl}
            alt={product!.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/30">
            MC
          </div>
        )}
      </div>

      {/* Price pill floating over image */}
      <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-2.5 py-1 rounded-full">
        <span className="text-xs font-semibold text-primary">
          {Number(product!.price).toFixed(0)} ETB
        </span>
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-foreground truncate">
          {product!.name}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: '#B58B67' }}>
          {product!.category?.name}
        </p>
      </div>
    </Link>
  )
}