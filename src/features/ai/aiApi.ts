import { baseApi } from '@/lib/api'

interface StartConversationResponse {
  sessionId:  string
  branchName: string
  message:    string
  expiresIn:  string
}

export interface OrderSummaryItem {
  name:      string
  quantity:  number
  unitPrice: number
  subtotal:  number
  notes:     string | null
}

export interface AiMessageResponse {
  sessionId:    string
  reply:        string
  intent:       string
  confidence:   number
  language:     string
  orderSummary: { items: OrderSummaryItem[]; total: number } | null
  order:        { orderNumber: string; totalAmount: string; status: string } | null
}

export interface AiVoiceResponse extends AiMessageResponse {
  transcript: string   // what Whisper heard — shown in chat
}

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startConversation: builder.mutation<StartConversationResponse, { branchId: string; customerName?: string }>({
      query: (body) => ({ url: '/ai/conversation/start', method: 'POST', body }),
    }),

    sendMessage: builder.mutation<AiMessageResponse, {
      sessionId: string
      message:   string
      guestName?: string
      guestPhone?: string
    }>({
      query: (body) => ({ url: '/ai/conversation/message', method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),

    // Voice endpoint — sends multipart/form-data with audio blob
    // Returns same shape as sendMessage but with a `transcript` field
    sendVoiceMessage: builder.mutation<AiVoiceResponse, FormData>({
      query: (formData) => ({
        url:    '/ai/conversation/voice',
        method: 'POST',
        body:   formData,
        // Do NOT set Content-Type manually — fetch sets it with the boundary
        formData: true,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
})

export const {
  useStartConversationMutation,
  useSendMessageMutation,
  useSendVoiceMessageMutation,
} = aiApi