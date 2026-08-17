import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { WifiOff } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectCartItems, selectCartTotal, selectCartBranchId } from '@/features/cart/cartSelectors'
import { clearCart } from '@/features/cart/cartSlice'
import { useCreateOrderMutation } from '@/features/orders/ordersApi'
import { useInitializePaymentMutation } from '@/features/payments/paymentsApi'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CheckoutPage() {
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const branchId = useAppSelector(selectCartBranchId)
  const dispatch = useAppDispatch()
  const { isOnline } = useNetworkStatus()

  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in')
  const [tableNumber, setTableNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'chapa'>('chapa')
  const navigate = useNavigate()

  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation()
  const [initializePayment, { isLoading: isInitializingPayment }] = useInitializePaymentMutation()

  const isSubmitting = isCreatingOrder || isInitializingPayment

  const handleCheckout = async () => {
    if (!navigator.onLine) {
      toast.error('Network offline: An active internet connection is required to place an order.', {
        icon: '📡',
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
      })
      return
    }

    // Validation
    if (!items || items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (!branchId) {
      toast.error('Your cart has no branch selected')
      return
    }

    if (orderType === 'dine_in' && !tableNumber) {
      toast.error('Please enter a table number for dine-in')
      return
    }

    if (paymentMethod === 'chapa' && !phoneNumber) {
      toast.error('Phone number is required for Chapa payment')
      return
    }

    try {
      // Build order payload
      const orderPayload = {
        branchId: branchId.trim(),
        type: orderType,
        tableNumber: orderType === 'dine_in' ? parseInt(tableNumber, 10) : undefined,
        items: items.map((i) => ({
          productId: i.productId.trim(),
          quantity: parseInt(String(i.quantity), 10),
          notes: i.notes?.trim() || '',
        })),
      }

      console.log('Creating order with payload:', orderPayload)

      // Step 1 — create the real order in the backend
      const order = await createOrder(orderPayload).unwrap()
      console.log('Order created:', order)

      // Step 2 — initialize Chapa payment for that order
      const paymentPayload = {
        orderId: order.id.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        method: paymentMethod,
      }

      console.log('Initializing payment with payload:', paymentPayload)

      const payment = await initializePayment(paymentPayload).unwrap()
      console.log('Payment initialized:', payment)

      // Step 3 — clear the cart now that the order is safely created
      dispatch(clearCart())

      // Step 4 — redirect the browser based on payment method
      if (payment.method === 'cash') {
        navigate(`/order/${order.id}/track`)
      } else if (payment.checkoutUrl) {
        window.location.href = payment.checkoutUrl
      } else {
        toast.error('No checkout URL received from payment provider')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)

      // Better error message extraction
      let errorMessage = 'Checkout failed'

      if (err?.data?.error?.message) {
        errorMessage = err.data.error.message
      } else if (err?.data?.message) {
        errorMessage = err.data.message
      } else if (err?.data?.error) {
        errorMessage = typeof err.data.error === 'string' ? err.data.error : JSON.stringify(err.data.error)
      } else if (err?.message) {
        errorMessage = err.message
      }

      toast.error(errorMessage)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-foreground mb-4">Your cart is empty.</p>
          <Link to="/menu">
            <Button>Back to menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Checkout</h1>

        {!isOnline && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs md:text-sm flex items-center gap-3 shadow-md">
            <WifiOff size={18} className="shrink-0 text-amber-400 animate-pulse" />
            <div>
              <span className="font-bold">Offline Mode:</span> An active internet connection is required to place your order and initialize payment.
            </div>
          </div>
        )}

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

        {/* Table number for dine-in */}
        {orderType === 'dine_in' && (
          <div className="space-y-1.5">
            <Label htmlFor="table">Table number</Label>
            <Input
              id="table"
              type="number"
              placeholder="e.g. 4"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              min="1"
            />
          </div>
        )}

        {/* Payment Method */}
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <div className="flex gap-2">
            {(['chapa', 'cash'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  paymentMethod === method
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-foreground border-border'
                }`}
              >
                {method === 'chapa' ? 'Pay with Chapa' : 'Pay Cash at Counter'}
              </button>
            ))}
          </div>
        </div>

        {/* Phone number */}
        {paymentMethod === 'chapa' && (
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone number (for payment)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0912345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        )}

        {/* Order summary */}
        <div className="border border-border rounded-xl p-4 bg-card space-y-2">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <div className="flex-1">
                <span className="text-foreground">{item.quantity}x {item.productName}</span>
                {item.notes && <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>}
              </div>
              <span style={{ color: '#B58B67' }} className="ml-4 shrink-0">
                {(item.unitPrice * item.quantity).toFixed(0)} ETB
              </span>
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
          onClick={handleCheckout}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : paymentMethod === 'chapa' ? `Pay ${total.toFixed(0)} ETB with Chapa` : `Place Order (Pay ${total.toFixed(0)} ETB Cash)`}
        </Button>

        <Link to="/cart">
          <button className="w-full py-2 text-sm text-primary hover:text-primary/80 transition-colors">
            ← Back to cart
          </button>
        </Link>
      </div>
    </div>
  )
}