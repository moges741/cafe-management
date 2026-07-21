import { baseApi } from '@/lib/api'

export interface CartItem {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface CartResponse {
  id: string;
  userId: string;
  branchId?: string | null;
  items: CartItem[];
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
      transformResponse: (response: any) => {
        // Map backend CartItem (which has 'product' nested) to our CartItem format
        return {
          ...response,
          items: response.items.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            productName: item.product?.name,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            notes: item.notes,
          }))
        };
      }
    }),
    addItemToCart: builder.mutation<CartResponse, { productId: string; quantity: number; notes?: string }>({
      query: (body) => ({
        url: '/cart/items',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<CartResponse, { productId: string; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation<CartResponse, string>({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCartApi: builder.mutation<CartResponse, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    syncCart: builder.mutation<CartResponse, { productId: string; quantity: number; notes?: string }[]>({
      query: (items) => ({
        url: '/cart/sync',
        method: 'POST',
        body: items,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
})

export const {
  useGetCartQuery,
  useLazyGetCartQuery,
  useAddItemToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartApiMutation,
  useSyncCartMutation,
} = cartApi
