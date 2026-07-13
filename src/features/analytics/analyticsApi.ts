import { baseApi } from '@/lib/api'

interface DashboardData {
  sales: { totalRevenue: number; totalOrders: number; avgOrderValue: number }
  topProducts: { name: string; quantity: number; revenue: number }[]
  orderVolume: { date: string; count: number }[]
  inventoryAlerts: { productName: string; quantity: number; threshold: number }[]
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardData, { period: string; branchId?: string }>({
      query: (params) => ({ url: '/analytics/dashboard', params }),
      providesTags: ['Order', 'Inventory'],
    }),
  }),
})

export const { useGetDashboardQuery } = analyticsApi