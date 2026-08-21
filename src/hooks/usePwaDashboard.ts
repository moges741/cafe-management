import { useMemo, useEffect } from 'react'
import { useGetDashboardQuery, type DashboardData } from '@/features/analytics/analyticsApi'
import { useNetworkStatus } from './useNetworkStatus'

const DASHBOARD_CACHE_PREFIX = 'mr_cafe_cached_dashboard_'

function getSavedDashboard(branchId?: string): DashboardData | null {
  if (typeof window === 'undefined') return null
  try {
    const key = `${DASHBOARD_CACHE_PREFIX}${branchId || 'global'}`
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function usePwaDashboard(
  params: { period: string; branchId?: string },
  options?: { skip?: boolean }
) {
  const { isOnline } = useNetworkStatus()
  const { data: serverData, isLoading, isError, refetch } = useGetDashboardQuery(params, {
    skip: options?.skip,
    refetchOnReconnect: true,
  })

  // Save server data when received or fallback to local snapshot
  const data: DashboardData | null = useMemo(() => {
    if (serverData) {
      try {
        const key = `${DASHBOARD_CACHE_PREFIX}${params.branchId || 'global'}`
        localStorage.setItem(key, JSON.stringify(serverData))
      } catch {}
      return serverData
    }
    return getSavedDashboard(params.branchId)
  }, [serverData, params.branchId])

  useEffect(() => {
    if (isOnline && !options?.skip) {
      refetch()
    }
  }, [isOnline, options?.skip, refetch])

  return {
    data,
    isLoading: isLoading && !data,
    isError,
    isOnline,
    isStale: !isOnline && Boolean(data),
    refetch,
  }
}
