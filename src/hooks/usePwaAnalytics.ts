import { useMemo, useEffect } from 'react'
import { useGetDashboardQuery, type DashboardData } from '@/features/analytics/analyticsApi'
import { useNetworkStatus } from './useNetworkStatus'

const ANALYTICS_CACHE_PREFIX = 'mr_cafe_cached_analytics_'

function getSavedAnalytics(period: string, branchId?: string): DashboardData | null {
  if (typeof window === 'undefined') return null
  try {
    const key = `${ANALYTICS_CACHE_PREFIX}${branchId || 'global'}_${period}`
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function usePwaAnalytics(
  params: { period: string; branchId?: string },
  options?: { skip?: boolean }
) {
  const { isOnline } = useNetworkStatus()
  const isToday = params.period === 'today'

  const { data: serverData, isLoading, isError, refetch } = useGetDashboardQuery(params, {
    skip: options?.skip,
    refetchOnReconnect: true,
  })

  // Save server data when received or fallback to local query-specific snapshot
  const data: DashboardData | null = useMemo(() => {
    if (serverData) {
      try {
        const key = `${ANALYTICS_CACHE_PREFIX}${params.branchId || 'global'}_${params.period}`
        localStorage.setItem(key, JSON.stringify(serverData))
      } catch {}
      return serverData
    }
    return getSavedAnalytics(params.period, params.branchId)
  }, [serverData, params.branchId, params.period])

  useEffect(() => {
    if (isOnline && !options?.skip) {
      refetch()
    }
  }, [isOnline, options?.skip, params.period, refetch])

  const isCached = !serverData && Boolean(data)

  return {
    data,
    isLoading: isLoading && !data,
    isError,
    isOnline,
    isToday,
    isCached,
    refetch,
  }
}
