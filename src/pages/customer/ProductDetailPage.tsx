import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetProductByIdQuery } from '@/features/products/productsApi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading } = useGetProductByIdQuery(id!)

  // Build the full image list: primary imageUrl first, then gallery,
  // sorted by position — matches the backend contract exactly
  const allImages = product
    ? [
        ...(product.imageUrl ? [{ id: 'primary', url: product.imageUrl, position: -1 }] : []),
        ...(product.images ?? []).slice().sort((a, b) => a.position - b.position),
      ]
    : []

  const [activeImage, setActiveImage] = useState(0)

  if (isLoading) {
    return <div className="min-h-screen bg-background p-8 text-foreground">Loading...</div>
  }

  if (!product) {
    return <div className="min-h-screen bg-background p-8 text-foreground">Product not found.</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-4 border-b border-border">
        <Link to="/menu" className="text-sm text-primary">
          ← Back to menu
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 px-6 py-8 max-w-5xl mx-auto">
        {/* ── Image gallery ── */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border">
            {allImages.length > 0 ? (
              <img
                src={allImages[activeImage].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-primary/30">
                MC
              </div>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3">
              {allImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0',
                    activeImage === i ? 'border-primary' : 'border-border opacity-70'
                  )}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Details ── */}
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary mb-1">
              {product.category?.name}
            </p>
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
          </div>

          {product.description && (
            <p style={{ color: '#B58B67' }} className="text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          <p className="text-2xl font-bold text-primary">
            {Number(product.price).toFixed(0)} ETB
          </p>

          <Button className="w-full" size="lg">
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  )
}