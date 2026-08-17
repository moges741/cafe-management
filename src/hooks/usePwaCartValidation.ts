import { useEffect, useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectCartItems, selectCartBranchId } from '@/features/cart/cartSelectors'
import { setCart } from '@/features/cart/cartSlice'
import { useGetProductsQuery } from '@/features/products/productsApi'
import { useNetworkStatus } from './useNetworkStatus'
import toast from 'react-hot-toast'

export interface InvalidCartItem {
  productId: string
  productName: string
  reason: 'unavailable' | 'price_changed' | 'removed'
  oldPrice?: number
  newPrice?: number
}

export function usePwaCartValidation() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const branchId = useAppSelector(selectCartBranchId)
  const { isOnline } = useNetworkStatus()

  const { data: serverProducts = [] } = useGetProductsQuery(
    { branchId: branchId || undefined },
    { skip: !branchId || !isOnline, refetchOnReconnect: true }
  )

  const [invalidItems, setInvalidItems] = useState<InvalidCartItem[]>([])

  // Revalidate local cart items against authoritative server products when online
  useEffect(() => {
    if (!isOnline || !serverProducts || serverProducts.length === 0 || items.length === 0) {
      return
    }

    let cartUpdated = false
    const newItems = [...items]
    const currentInvalid: InvalidCartItem[] = []

    items.forEach((item, index) => {
      const serverProduct = serverProducts.find((p) => p.id === item.productId)
      if (!serverProduct) {
        currentInvalid.push({
          productId: item.productId,
          productName: item.productName,
          reason: 'removed',
        })
        return
      }

      if (!serverProduct.isAvailable) {
        currentInvalid.push({
          productId: item.productId,
          productName: item.productName,
          reason: 'unavailable',
        })
      }

      const serverPrice = Number(serverProduct.price)
      if (serverPrice !== item.unitPrice) {
        currentInvalid.push({
          productId: item.productId,
          productName: item.productName,
          reason: 'price_changed',
          oldPrice: item.unitPrice,
          newPrice: serverPrice,
        })

        // Update item price in cart to match current server truth
        newItems[index] = {
          ...newItems[index],
          unitPrice: serverPrice,
        }
        cartUpdated = true
      }
    })

    if (cartUpdated) {
      dispatch(setCart(newItems))
      toast('Cart item prices updated to match latest server catalog', { icon: 'ℹ️' })
    }

    setInvalidItems(currentInvalid)
  }, [serverProducts, isOnline, items, dispatch])

  const hasUnavailableItems = useMemo(
    () => invalidItems.some((i) => i.reason === 'unavailable' || i.reason === 'removed'),
    [invalidItems]
  )

  return {
    isOnline,
    invalidItems,
    hasUnavailableItems,
  }
}
