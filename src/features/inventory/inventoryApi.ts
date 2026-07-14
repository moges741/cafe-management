import { baseApi } from '@/lib/api'
//let's add InventoryItem as a type here 


export interface InventoryItem {
  id:           string
  name:         string
  quantity:     number
  unit:         string
  lowStockThreshold: number
  productId:    string | null
  branchId?:    string
  product?:     { id: string; name: string; price: string | number }
  branch?:      { id: string; name: string }
  logs?:        Array<{
    id: string
    delta: number
    reason: string
    note?: string | null
    quantityBefore: number
    quantityAfter: number
    createdAt: string
    actor?: { id: string; email: string } | null
    order?: { id: string; orderNumber: string } | null
  }>
}

interface GetInventoryParams {
  branchId?: string
  lowStockOnly?: boolean
}

interface CreateInventoryRequest {
  productId: string
  branchId: string
  openingQuantity: number
  reorderThreshold?: number
  unit?: string
}

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query<InventoryItem[], GetInventoryParams | void>({
      query: (params) => ({ url: '/inventory', params }),
      providesTags: ['Inventory'],
    }),

    getInventoryById: builder.query<InventoryItem, string>({
      query: (id) => `/inventory/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Inventory', id }],
    }),

    createInventory: builder.mutation<InventoryItem, CreateInventoryRequest>({
      query: (body) => ({ url: '/inventory', method: 'POST', body }),
      invalidatesTags: ['Inventory'],
    }),

    adjustInventory: builder.mutation<InventoryItem, { id: string; delta: number; reason: string }>({
      query: ({ id, ...body }) => ({ url: `/inventory/${id}/adjust`, method: 'PATCH', body }),
      invalidatesTags: ['Inventory'],
    }),
  }),
})

export const { useGetInventoryQuery, useGetInventoryByIdQuery, useCreateInventoryMutation, useAdjustInventoryMutation } = inventoryApi