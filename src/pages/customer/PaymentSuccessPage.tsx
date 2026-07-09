import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
        <span className="text-primary text-2xl">✓</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Payment received</h1>
      <p className="text-sm mb-6" style={{ color: '#B58B67' }}>
        Your order has been sent to the kitchen. You'll be able to track it live shortly.
      </p>
      <Link to="/menu">
        <Button>Back to menu</Button>
      </Link>
    </div>
  )
}