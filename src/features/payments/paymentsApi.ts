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

    confirmCashPayment: builder.mutation<any, { orderId: string }>({
  query: (body) => ({ url: '/payments/cash-confirm', method: 'POST', body }),
  invalidatesTags: ['Order', 'Payment'],
}),
  }),
})

export const { useInitializePaymentMutation, useConfirmCashPaymentMutation } = paymentsApi