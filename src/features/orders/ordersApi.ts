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
export interface OrderItemDetail {
  productId:   string
  quantity:    number
  notes?:      string | null
  product?:    {
    id: string
    name: string
    price?: string | number
    categoryId?: string | null
  }
  productName?: string
  categoryId?:  string
}

export interface Order {
  id:          string
  orderNumber: string
  status:      string
  totalAmount: string
  branchId:    string
  type?:       'dine_in' | 'takeaway'
  tableNumber?: number | null
  notes?:      string | null
  createdAt?:  string
  customer?:   { id: string; email: string } | null
  items?:      OrderItemDetail[] // ← only useful if backend actually returns this
}

interface GetOrdersParams {
  branchId?: string
  status?: string
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

    getOrders: builder.query<Order[], GetOrdersParams | void>({
      query: (params) => ({ url: '/orders', params }),
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

