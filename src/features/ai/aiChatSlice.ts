import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
interface ChatMessage {
  role:    'user' | 'assistant'
  content: string
}

interface AiChatState {
  sessionId:    string | null
  messages:     ChatMessage[]
  orderSummary: { items: any[]; total: number } | null
  placedOrder:  { orderNumber: string; totalAmount: string } | null
}

const initialState: AiChatState = {
  sessionId:    null,
  messages:     [],
  orderSummary: null,
  placedOrder:  null,
}

const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<{ sessionId: string; welcomeMessage: string }>) => {
      state.sessionId = action.payload.sessionId
      state.messages  = [{ role: 'assistant', content: action.payload.welcomeMessage }]
      state.orderSummary = null
      state.placedOrder  = null
    },

    addUserMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({ role: 'user', content: action.payload })
    },

    addAssistantMessage: (state, action: PayloadAction<{
      content:       string
      orderSummary?: { items: any[]; total: number } | null
      placedOrder?:  { orderNumber: string; totalAmount: string } | null
    }>) => {
      state.messages.push({ role: 'assistant', content: action.payload.content })
      if (action.payload.orderSummary !== undefined) {
        state.orderSummary = action.payload.orderSummary
      }
      if (action.payload.placedOrder) {
        state.placedOrder = action.payload.placedOrder
      }
    },

    resetChat: () => initialState,
  },
})

export const { startSession, addUserMessage, addAssistantMessage, resetChat } = aiChatSlice.actions
export default aiChatSlice.reducer