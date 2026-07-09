import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectCartItemCount } from '@/features/cart/cartSelectors'

export default function CartBadge() {
  const count = useAppSelector(selectCartItemCount)

  return (
    <Link to="/cart" className="relative">
      <span className="text-foreground text-sm">Cart</span>
      {count > 0 && (
        <span className="absolute -top-2 -right-3 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  )
}