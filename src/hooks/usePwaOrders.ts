import { useMemo, useEffect } from 'react'
import { useGetOrdersQuery, type Order } from '@/features/orders/ordersApi'
import { useNetworkStatus } from './useNetworkStatus'

const ORDERS_CACHE_PREFIX = 'mr_cafe_cached_orders_'

function getSavedOrders(branchId?: string): Order[] {
  if (typeof window === 'undefined') return []
  try {
    const key = `${ORDERS_CACHE_PREFIX}${branchId || 'global'}`
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function usePwaOrders(
  params?: { branchId?: string; status?: string; days?: number },
  options?: { skip?: boolean }
) {
  const { isOnline } = useNetworkStatus()
  const { data: serverOrders, isLoading, isError, refetch } = useGetOrdersQuery(params, {
    skip: options?.skip,
    refetchOnReconnect: true,
  })

  // Save server data when received or fallback to local offline snapshot
  const orders: Order[] = useMemo(() => {
    if (serverOrders && serverOrders.length > 0) {
      try {
        const key = `${ORDERS_CACHE_PREFIX}${params?.branchId || 'global'}`
        localStorage.setItem(key, JSON.stringify(serverOrders))
      } catch {}
      return serverOrders
    }
    return getSavedOrders(params?.branchId)
  }, [serverOrders, params?.branchId])

  useEffect(() => {
    if (isOnline && !options?.skip) {
      refetch()
    }
  }, [isOnline, options?.skip, refetch])

  return {
    orders,
    isLoading: isLoading && orders.length === 0,
    isError,
    isOnline,
    refetch,
  }
}
