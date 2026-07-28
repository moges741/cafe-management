import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Search, AlertCircle } from 'lucide-react'
import { useGetProductsQuery, useToggleProductAvailabilityMutation } from '@/features/products/productsApi'
import { useGetCategoriesQuery } from '@/features/categories/categoriesApi'
import { useAppSelector } from '@/app/hooks'

interface MenuAvailabilityManagerProps {
  filterType?: 'drink' | 'food'
}

export default function MenuAvailabilityManager({ filterType }: MenuAvailabilityManagerProps) {
  const user = useAppSelector((state) => state.auth.user)
  const branchId = user?.employee?.branchId

  const { data: products = [], isLoading: isLoadingProducts } = useGetProductsQuery(
    { branchId: branchId || undefined },
    { skip: !branchId }
  )

  const { data: allCategories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery(
    { branchId: branchId || undefined },
    { skip: !branchId }
  )

  const categories = useMemo(() => {
    if (!filterType) return allCategories;
    return allCategories.filter(c => {
      const isDrink = ['drink', 'coffee', 'tea', 'beverage'].some(k => c.name.toLowerCase().includes(k))
      return filterType === 'drink' ? isDrink : !isDrink
    });
  }, [allCategories, filterType])

  const [toggleAvailability] = useToggleProductAvailabilityMutation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const handleToggle = async (productId: string) => {
    try {
      await toggleAvailability(productId).unwrap()
    } catch (error) {
      console.error('Failed to toggle availability', error)
    }
  }

  const filteredProducts = useMemo(() => {
    // Collect all valid category IDs from the current categories list
    const validCategoryIds = new Set(categories.map(c => c.id))
    
    return products.filter((product) => {
      // If we have a filterType, ensure the product belongs to a valid category
      if (filterType && !validCategoryIds.has(product.categoryId)) return false;
      
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory ? product.categoryId === activeCategory : true
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, activeCategory, categories, filterType])

  if (isLoadingProducts || isLoadingCategories) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm uppercase tracking-widest font-bold">Loading Menu Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl">
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            Menu Visibility
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Toggle items on or off to hide them from the customer menu immediately.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative group w-full md:w-72 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-amber-500 transition-colors" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-neutral-600"
          />
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
            activeCategory === null
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl">
          <AlertCircle className="w-12 h-12 text-neutral-600 mb-4" />
          <p className="text-neutral-400 font-medium">No items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id}
                className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                  product.isAvailable
                    ? 'bg-white/5 border-white/10 hover:border-amber-500/30'
                    : 'bg-red-950/20 border-red-900/30 opacity-75'
                }`}
              >
                {/* Product Image */}
                <div className="w-16 h-16 rounded-xl bg-black/50 shrink-0 overflow-hidden relative">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className={`w-full h-full object-cover ${!product.isAvailable ? 'grayscale opacity-50' : ''}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 font-black text-xl">
                      {product.name.charAt(0)}
                    </div>
                  )}
                  {/* Status Overlay */}
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center">
                      <EyeOff className="w-6 h-6 text-red-500" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{product.name}</h3>
                  <p className="text-xs text-neutral-400 font-mono mt-1">
                    {Number(product.price).toLocaleString()} ETB
                  </p>
                </div>

                {/* Custom Toggle Switch */}
                <button
                  onClick={() => handleToggle(product.id)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 shrink-0 focus:outline-none ${
                    product.isAvailable ? 'bg-amber-500' : 'bg-neutral-800'
                  }`}
                >
                  <motion.div
                    animate={{ x: product.isAvailable ? 24 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                  >
                    {product.isAvailable ? (
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                  </motion.div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
