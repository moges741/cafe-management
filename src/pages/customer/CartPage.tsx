import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { removeItem, updateQuantity } from '@/features/cart/cartSlice'
import { selectCartItems, selectCartTotal } from '@/features/cart/cartSelectors'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <p className="text-foreground text-lg font-medium mb-2">Your cart is empty</p>
        <p className="text-sm mb-6" style={{ color: '#B58B67' }}>Add something delicious from the menu.</p>
        <Link to="/menu">
          <Button>Browse menu</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-4 border-b border-border">
        <Link to="/menu" className="text-sm text-primary">← Continue shopping</Link>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Your order</h1>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-3 border border-border rounded-xl p-3 bg-card"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.productName}</p>
                {item.notes && (
                  <p className="text-xs mt-0.5" style={{ color: '#B58B67' }}>{item.notes}</p>
                )}
                <p className="text-xs mt-1 text-primary">{item.unitPrice} ETB each</p>
              </div>

              <div className="flex items-center border border-border rounded-full overflow-hidden shrink-0">
                <button
                  onClick={() => dispatch(updateQuantity({
                    productId: item.productId,
                    quantity: Math.max(1, item.quantity - 1),
                  }))}
                  className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-secondary text-sm"
                >−</button>
                <span className="w-8 text-center text-sm text-foreground">{item.quantity}</span>
                <button
                  onClick={() => dispatch(updateQuantity({
                    productId: item.productId,
                    quantity: item.quantity + 1,
                  }))}
                  className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-secondary text-sm"
                >+</button>
              </div>

              <button
                onClick={() => dispatch(removeItem(item.productId))}
                className="text-xs text-destructive shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-foreground font-medium">Total</span>
          <span className="text-xl font-bold text-primary">{total.toFixed(0)} ETB</span>
        </div>

        <Button className="w-full mt-4" size="lg" onClick={() => navigate('/checkout')}>
          Proceed to checkout
        </Button>
      </div>
    </div>
  )
}