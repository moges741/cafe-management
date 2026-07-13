import { baseApi } from '@/lib/api'

export interface InventoryItem {
  id:           string
  name:         string
  quantity:     number
  unit:         string
  lowStockThreshold: number
  productId:    string | null
}

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query<InventoryItem[], void>({
      query: () => '/inventory',
      providesTags: ['Inventory'],
    }),

    adjustInventory: builder.mutation<InventoryItem, { id: string; quantity: number; reason: string }>({
      query: ({ id, ...body }) => ({ url: `/inventory/${id}/adjust`, method: 'PATCH', body }),
      invalidatesTags: ['Inventory'],
    }),
  }),
})

export const { useGetInventoryQuery, useAdjustInventoryMutation } = inventoryApi