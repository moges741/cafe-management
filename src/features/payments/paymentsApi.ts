import { baseApi } from '@/lib/api'

interface InitializePaymentRequest {
  orderId:      string
  phoneNumber?: string
}

interface InitializePaymentResponse {
  checkoutUrl: string
  txRef:       string
  amount:      string
  orderNumber: string
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initializePayment: builder.mutation<InitializePaymentResponse, InitializePaymentRequest>({
      query: (body) => ({ url: '/payments/initialize', method: 'POST', body }),
      invalidatesTags: ['Payment'],
    }),
  }),
})

export const { useInitializePaymentMutation } = paymentsApi