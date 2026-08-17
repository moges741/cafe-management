import { useMemo, useEffect } from 'react'
import { useGetCategoriesQuery, type Category } from '@/features/categories/categoriesApi'
import { useNetworkStatus } from './useNetworkStatus'

const CATEGORIES_CACHE_PREFIX = 'mr_cafe_cached_categories_'

function getSavedCategories(branchId?: string, includeInactive?: boolean): Category[] {
  if (typeof window === 'undefined') return []
  try {
    const key = `${CATEGORIES_CACHE_PREFIX}${branchId || 'global'}`
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const list: Category[] = JSON.parse(raw)
    if (!includeInactive) {
      return list.filter((c) => c.isActive)
    }
    return list
  } catch {
    return []
  }
}

export function usePwaCategories(
  params?: { includeInactive?: boolean; branchId?: string },
  options?: { skip?: boolean }
) {
  const { isOnline } = useNetworkStatus()
  const { data: serverData, isLoading, isError, refetch } = useGetCategoriesQuery(params, {
    skip: options?.skip,
    refetchOnReconnect: true,
  })

  // Cache server data when received or fallback to offline local snapshot
  const categories: Category[] = useMemo(() => {
    if (serverData && serverData.length > 0) {
      try {
        const key = `${CATEGORIES_CACHE_PREFIX}${params?.branchId || 'global'}`
        localStorage.setItem(key, JSON.stringify(serverData))
      } catch {}
      return serverData
    }
    return getSavedCategories(params?.branchId, params?.includeInactive)
  }, [serverData, params?.branchId, params?.includeInactive])

  // Refetch when returning online
  useEffect(() => {
    if (isOnline && !options?.skip) {
      refetch()
    }
  }, [isOnline, options?.skip, refetch])

  return {
    categories,
    isLoading: isLoading && categories.length === 0,
    isError,
    isOnline,
    refetch,
  }
}
