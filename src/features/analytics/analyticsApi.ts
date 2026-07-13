import { baseApi } from '@/lib/api'

interface SalesSummary {
  period:        string
  branchId:      string
  totalRevenue:  number
  totalOrders:   number
  averageOrder:  string // backend sends this as a string, e.g. "45.00"
  ordersByStatus: Record<string, number>
}

interface TopProduct {
  rank:      number
  productId: string
  name:      string
  unitsSold: number
  revenue:   number
}

interface OrderVolume {
  byStatus: Record<string, number>
  byDay:    { date: string; count: number }[]
}

interface InventoryConsumption {
  inventoryId:  string
  productName:  string
  unit:         string
  currentStock: number
  movements:    Record<string, number>
}

interface LowStockAlert {
  productName: string
  quantity:    number
  threshold:   number
}

export interface DashboardData {
  generatedAt:          string
  period:                string
  branchId:               string
  salesSummary:           SalesSummary
  topProducts:            TopProduct[]
  orderVolume:            OrderVolume
  inventoryConsumption:   InventoryConsumption[]
  lowStockAlerts:         LowStockAlert[]
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