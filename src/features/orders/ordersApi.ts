import { baseApi } from '@/lib/api'

interface CreateOrderItem {
  productId: string
  quantity:  number
  notes?:    string
}

interface CreateOrderRequest {
  branchId:     string
  type:         'dine_in' | 'takeaway'
  tableNumber?: number
  notes?:       string
  items:        CreateOrderItem[]
}

export interface Order {
  id:          string
  orderNumber: string
  status:      string
  totalAmount: string
  branchId:    string
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),

    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),

    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),

    updateOrderStatus: builder.mutation<Order, { orderId: string; status: string }>({
        query: ({ orderId, status }) => ({
        url:    `/orders/${orderId}/status`,
        method: 'PATCH',
        body:   { status },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi

