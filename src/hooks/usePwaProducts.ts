import { useMemo, useEffect } from 'react'
import { useGetProductsQuery, type Product } from '@/features/products/productsApi'
import { useNetworkStatus } from './useNetworkStatus'

const PRODUCTS_CACHE_PREFIX = 'mr_cafe_cached_products_'

function getSavedProducts(branchId?: string, categoryId?: string, isAvailable?: boolean): Product[] {
  if (typeof window === 'undefined') return []
  try {
    const key = `${PRODUCTS_CACHE_PREFIX}${branchId || 'global'}`
    const raw = localStorage.getItem(key)
    if (!raw) return []
    let list: Product[] = JSON.parse(raw)
    if (categoryId) {
      list = list.filter((p) => p.categoryId === categoryId)
    }
    if (isAvailable !== undefined) {
      list = list.filter((p) => p.isAvailable === isAvailable)
    }
    return list
  } catch {
    return []
  }
}

export function usePwaProducts(
  params?: { branchId?: string; categoryId?: string; isAvailable?: boolean },
  options?: { skip?: boolean }
) {
  const { isOnline } = useNetworkStatus()
  const { data: serverData, isLoading, isError, refetch } = useGetProductsQuery(params || {}, {
    skip: options?.skip,
    refetchOnReconnect: true,
  })

  // Cache server data when received or fallback to offline local snapshot
  const products: Product[] = useMemo(() => {
    if (serverData && serverData.length > 0) {
      try {
        const key = `${PRODUCTS_CACHE_PREFIX}${params?.branchId || 'global'}`
        localStorage.setItem(key, JSON.stringify(serverData))
      } catch {}
      return serverData
    }
    return getSavedProducts(params?.branchId, params?.categoryId, params?.isAvailable)
  }, [serverData, params?.branchId, params?.categoryId, params?.isAvailable])

  // Refetch when returning online
  useEffect(() => {
    if (isOnline && !options?.skip) {
      refetch()
    }
  }, [isOnline, options?.skip, refetch])

  return {
    products,
    isLoading: isLoading && products.length === 0,
    isError,
    isOnline,
    refetch,
  }
}
