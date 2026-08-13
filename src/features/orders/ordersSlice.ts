import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface TrackedOrder {
  id:          string
  orderNumber: string
  status:      string
  branchId:    string
  createdAt?:  string
  payment?:    { id: string; status: string; method: string } | null
  items?:      Array<{ id?: string; productId?: string; quantity: number; product?: { name: string; price?: string | number } }>
  type?:       string
  tableNumber?: number | string | null
}

interface OrdersState {
  // Keyed by order id for fast lookup — { "uuid": {...} }
  // This is a common Redux pattern called "normalization"
  byId: Record<string, TrackedOrder>
}

const initialState: OrdersState = {
  byId: {},
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Called when a NEW order arrives via Socket.io (kitchen.new_order)
    // or when we start tracking an order after checkout
    upsertOrder: (state, action: PayloadAction<TrackedOrder>) => {
      state.byId[action.payload.id] = action.payload
    },

    // Called when order.status.updated fires — only patches the status field
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: string }>
    ) => {
      const order = state.byId[action.payload.orderId]
      if (order) {
        order.status = action.payload.status
      }
    },

    // Called when a payment status changes (e.g. Chapa webhook confirms) —
    // patches only the payment field so waiter sees "Paid" instantly
    updateOrderPayment: (
      state,
      action: PayloadAction<{ orderId: string; payment: { id: string; status: string; method: string } | null }>
    ) => {
      const order = state.byId[action.payload.orderId]
      if (order) {
        order.payment = action.payload.payment
      }
    },
  },
})

export const { upsertOrder, updateOrderStatus, updateOrderPayment } = ordersSlice.actions
export default ordersSlice.reducer