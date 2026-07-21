import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectCartItems, selectCartTotal, selectCartBranchId } from '@/features/cart/cartSelectors'
import { clearCart } from '@/features/cart/cartSlice'
import { useCreateOrderMutation } from '@/features/orders/ordersApi'
import { useInitializePaymentMutation } from '@/features/payments/paymentsApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/layout/Navbar' 
export default function CheckoutPage() {
  const items    = useAppSelector(selectCartItems)
  const total    = useAppSelector(selectCartTotal)
  const branchId = useAppSelector(selectCartBranchId)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [orderType, setOrderType]     = useState<'dine_in' | 'takeaway'>('dine_in')
  const [tableNumber, setTableNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation()
  const [initializePayment, { isLoading: isInitializingPayment }] = useInitializePaymentMutation()

  const isSubmitting = isCreatingOrder || isInitializingPayment

  const handlePayWithChapa = async () => {
    if (!branchId) {
      toast.error('Your cart has no branch selected')
      return
    }

    try {
      // Step 1 — create the real order in the backend
      const order = await createOrder({
        branchId,
        type: orderType,
        tableNumber: orderType === 'dine_in' && tableNumber ? Number(tableNumber) : undefined,
        items: items.map(i => ({
          productId: i.productId,
          quantity:  i.quantity,
          notes:     i.notes,
        })),
      }).unwrap()

      // Step 2 — initialize Chapa payment for that order
      const payment = await initializePayment({
        orderId:     order.id,
        phoneNumber: phoneNumber || undefined,
      }).unwrap()

      // Step 3 — clear the cart now that the order is safely created
      dispatch(clearCart())

      // Step 4 — redirect the browser to Chapa's hosted checkout
      window.location.href = payment.checkoutUrl

    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Checkout failed')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <div className="px-6 py-4 border-b border-border">
        <Link to="/cart" className="text-sm text-primary">← Back to cart</Link>
      </div> */}


      <div className="mt-20 max-w-xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Checkout</h1>

        {/* Order type */}
        <div className="space-y-2">
          <Label>Order type</Label>
          <div className="flex gap-2">
            {(['dine_in', 'takeaway'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  orderType === type
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-foreground border-border'
                }`}
              >
                {type === 'dine_in' ? 'Dine in' : 'Takeaway'}
              </button>
            ))}
          </div>
        </div>

        {orderType === 'dine_in' && (
          <div className="space-y-1.5">
            <Label htmlFor="table">Table number</Label>
            <Input
              id="table"
              type="number"
              placeholder="e.g. 4"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number (for Telebirr/CBE Birr)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="0912345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Order summary */}
        <div className="border border-border rounded-xl p-4 bg-card space-y-2">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-foreground">{item.quantity}x {item.productName}</span>
              <span style={{ color: '#B58B67' }}>{(item.unitPrice * item.quantity).toFixed(0)} ETB</span>
            </div>
          ))}
          <div className="pt-2 border-t border-border flex justify-between font-medium">
            <span className="text-foreground">Total</span>
            <span className="text-primary">{total.toFixed(0)} ETB</span>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handlePayWithChapa}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : `Pay ${total.toFixed(0)} ETB with Chapa`}
        </Button>
      </div>
    </div>
  )
}