import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useGetProductByIdQuery } from '@/features/products/productsApi'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { addItem, setBranch } from '@/features/cart/cartSlice'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
        ...(product.images ?? []).slice().sort((a, b) => a.position - b.position),
      ]
    : []

  if (isLoading) return <div className="min-h-screen bg-background p-8 text-foreground">Loading...</div>
  if (!product) return <div className="min-h-screen bg-background p-8 text-foreground">Product not found.</div>

  const handleAddToCart = () => {
    dispatch(setBranch(product.branchId)) // clears cart if switching branch
    dispatch(addItem({
      productId:   product.id,
      productName: product.name,
      quantity,
      unitPrice:   Number(product.price),
      notes:       notes || undefined,
    }))
    toast.success(`${quantity}x ${product.name} added to cart`)
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-4 border-b border-border">
        <Link to="/menu" className="text-sm text-primary">← Back to menu</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 px-6 py-8 max-w-5xl mx-auto">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border">
            {allImages.length > 0 ? (
              <img src={allImages[activeImage].url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-primary/30">MC</div>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3">
              {allImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={cn('w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0',
                    activeImage === i ? 'border-primary' : 'border-border opacity-70')}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary mb-1">{product.category?.name}</p>
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
          </div>

          {product.description && (
            <p style={{ color: '#B58B67' }} className="text-sm leading-relaxed">{product.description}</p>
          )}

          <p className="text-2xl font-bold text-primary">{Number(product.price).toFixed(0)} ETB</p>

          {/* Quantity stepper */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground">Quantity</span>
            <div className="flex items-center border border-border rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-secondary"
              >−</button>
              <span className="w-10 text-center text-sm text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-secondary"
              >+</button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-sm text-foreground">Special instructions</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. no sugar, extra hot"
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <Button className="w-full" size="lg" onClick={handleAddToCart}>
            Add to cart — {(Number(product.price) * quantity).toFixed(0)} ETB
          </Button>
        </div>
      </div>
    </div>
  )
}