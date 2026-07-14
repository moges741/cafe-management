import { Link } from 'react-router-dom'
import { Plus, ImageOff } from 'lucide-react'
import { useGetProductsQuery, useToggleProductAvailabilityMutation } from '@/features/products/productsApi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

export default function ProductsPage() {
  const { data: products = [], isLoading } = useGetProductsQuery({ branchId: BRANCH_ID })
  const [toggleAvailability] = useToggleProductAvailabilityMutation()

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <Link to="/admin/products/new">
          <Button>
            <Plus size={15} className="mr-1.5" /> New product
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square rounded-2xl bg-card animate-pulse" />)}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/admin/products/${product.id}/edit`}
            className="group rounded-2xl border border-border bg-card overflow-hidden block"
          >
            <div className="aspect-square bg-secondary flex items-center justify-center">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ImageOff size={22} className="text-muted-foreground" />
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
              <p className="text-xs text-primary mt-0.5">{Number(product.price).toFixed(0)} ETB</p>
              <button
                onClick={(e) => { e.preventDefault(); toggleAvailability(product.id) }}
                className={cn(
                  'mt-2 text-[11px] px-2 py-0.5 rounded-full inline-block',
                  product.isAvailable ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'
                )}
              >
                {product.isAvailable ? 'Available' : 'Unavailable'}
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}