import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

export default function Navbar() {
  const cartCount = useAppSelector(state => state.cart.items.length)

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-bold text-foreground text-lg">Mr. Cafe</Link>
        <div className="hidden md:flex gap-6 text-sm text-foreground">
          <Link to="/menu">Menu</Link>
          <Link to="/#about">About</Link>
          <Link to="/#gallery">Gallery</Link>
          <Link to="/#contact">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="text-sm text-foreground">Cart{cartCount > 0 && ` (${cartCount})`}</Link>
          <Link to="/login" className="text-sm text-primary">Log in</Link>
        </div>
      </div>
    </nav>
  )
}