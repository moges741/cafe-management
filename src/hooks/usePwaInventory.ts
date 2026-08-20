import { useMemo, useEffect } from 'react'
import { useGetInventoryQuery, type InventoryItem } from '@/features/inventory/inventoryApi'
import { useNetworkStatus } from './useNetworkStatus'

const INVENTORY_CACHE_PREFIX = 'mr_cafe_cached_inventory_'

function getSavedInventory(branchId?: string): InventoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const key = `${INVENTORY_CACHE_PREFIX}${branchId || 'global'}`
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function usePwaInventory(
  params?: { branchId?: string; lowStockOnly?: boolean },
  options?: { skip?: boolean }
) {
  const { isOnline } = useNetworkStatus()
  const { data: serverInventory, isLoading, isError, refetch } = useGetInventoryQuery(params, {
    skip: options?.skip,
    refetchOnReconnect: true,
  })

  // Save server data when received or fallback to local offline snapshot
  const items: InventoryItem[] = useMemo(() => {
    if (serverInventory && serverInventory.length > 0) {
      try {
        const key = `${INVENTORY_CACHE_PREFIX}${params?.branchId || 'global'}`
        localStorage.setItem(key, JSON.stringify(serverInventory))
      } catch {}
      return serverInventory
    }
    return getSavedInventory(params?.branchId)
  }, [serverInventory, params?.branchId])

  useEffect(() => {
    if (isOnline && !options?.skip) {
      refetch()
    }
  }, [isOnline, options?.skip, refetch])

  return {
    items,
    isLoading: isLoading && items.length === 0,
    isError,
    isOnline,
    refetch,
  }
}
