import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
interface TrackedOrder {
  id:          string
  orderNumber: string
  status:      string
  branchId:    string
  createdAt?:  string
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

    // Called when order.status.updated fires — only patches the status field,
    // doesn't need the full order object
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: string }>
    ) => {
      const order = state.byId[action.payload.orderId]
      if (order) {
        order.status = action.payload.status
      }
    },
  },
})

export const { upsertOrder, updateOrderStatus } = ordersSlice.actions
export default ordersSlice.reducer