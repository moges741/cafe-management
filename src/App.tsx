import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { setUser, clearUser } from './features/auth/authSlice'
import { addItem, clearCart } from './features/cart/cartSlice'

function App() {
  // useAppSelector reads a slice of state — component re-renders
  // automatically whenever THIS specific piece of state changes
  const user  = useAppSelector(state => state.auth.user)
  const items = useAppSelector(state => state.cart.items)

  // useAppDispatch gives you the dispatch function to trigger changes
  const dispatch = useAppDispatch()

  return (
    <div className="min-h-screen bg-background text-foreground p-8 space-y-4">
      <h1 className="text-2xl font-bold">Redux Test</h1>

      <div>
        <p>User: {user ? user.email : 'Not logged in'}</p>
        <Button onClick={() => dispatch(setUser({
          id: '1', email: 'test@smartcafe.com', role: 'customer'
        }))}>
          Simulate Login
        </Button>
        <Button variant="outline" onClick={() => dispatch(clearUser())}>
          Logout
        </Button>
      </div>

      <div>
        <p>Cart items: {items.length}</p>
        <Button onClick={() => dispatch(addItem({
          productId: 'p1', productName: 'Macchiato',
          quantity: 1, unitPrice: 45,
        }))}>
          Add Macchiato
        </Button>
        <Button variant="outline" onClick={() => dispatch(clearCart())}>
          Clear Cart
        </Button>
      </div>
    </div>
  )
}

export default App