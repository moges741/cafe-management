import { baseApi } from '@/lib/api'

interface StartConversationResponse {
  sessionId:  string
  branchName: string
  message:    string
  expiresIn:  string
}

interface OrderSummaryItem {
  name:      string
  quantity:  number
  unitPrice: number
  subtotal:  number
  notes:     string | null
}

interface SendMessageResponse {
  sessionId:    string
  reply:        string
  intent:       string
  confidence:   number
  language:     string
  orderSummary: { items: OrderSummaryItem[]; total: number } | null
  order:        { orderNumber: string; totalAmount: string; status: string } | null
}

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startConversation: builder.mutation<StartConversationResponse, { branchId: string; customerName?: string }>({
      query: (body) => ({ url: '/ai/conversation/start', method: 'POST', body }),
    }),

    sendMessage: builder.mutation<SendMessageResponse, {
      sessionId: string
      message:   string
      guestName?: string
      guestPhone?: string
    }>({
      query: (body) => ({ url: '/ai/conversation/message', method: 'POST', body }),
      invalidatesTags: ['Order'], // kitchen/cashier lists refresh once an AI order is placed
    }),
  }),
})

export const { useStartConversationMutation, useSendMessageMutation } = aiApi