import { Link } from 'react-router-dom'
import { Plus, ImageOff, WifiOff } from 'lucide-react'
import { useToggleProductAvailabilityMutation } from '@/features/products/productsApi'
import { usePwaProducts } from '@/hooks/usePwaProducts'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const { branchId } = useCurrentBranch()
  const { products, isLoading, isOnline } = usePwaProducts({ branchId: branchId || undefined }, { skip: !branchId })
  const [toggleAvailability] = useToggleProductAvailabilityMutation()

  const handleToggle = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    if (!navigator.onLine) {
      toast.error('Network offline: Internet connection is required to change product availability.', {
        icon: '📡',
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
      })
      return
    }

    try {
      await toggleAvailability(id).unwrap()
    } catch {
      toast.error('Could not update product availability')
    }
  }

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

      {!isOnline && (
        <div className="p-4 mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs md:text-sm flex items-center gap-3 shadow-md">
          <WifiOff size={18} className="shrink-0 text-amber-400 animate-pulse" />
          <div>
            <span className="font-bold">Offline Mode (Cached Catalog):</span> Internet connection is required to create products, edit pricing, or toggle availability.
          </div>
        </div>
      )}

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
                onClick={(e) => handleToggle(e, product.id)}
                className={cn(
                  'mt-2 text-[11px] px-2 py-0.5 rounded-full inline-block cursor-pointer',
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