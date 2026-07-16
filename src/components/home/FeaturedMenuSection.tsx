import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useGetProductsQuery } from '@/features/products/productsApi'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

export default function FeaturedMenuSection() {
  const { data: products = [], isLoading } = useGetProductsQuery({ branchId: BRANCH_ID, isAvailable: true })
  const featured = products.slice(0, 4)

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-foreground">Featured menu</h2>
          <Link to="/menu" className="flex items-center gap-1 text-sm text-primary">
            View full menu <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-square rounded-2xl bg-card animate-pulse" />)}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((product) => (
            <Link key={product.id} to={`/menu/${product.id}`} className="group rounded-2xl overflow-hidden border border-border bg-card block">
              <div className="aspect-square bg-secondary">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary/30">MC</div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                <p className="text-xs text-primary mt-0.5">{Number(product.price).toFixed(0)} ETB</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}