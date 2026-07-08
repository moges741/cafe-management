import { createSlice } from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'

interface CartItem {
  productId:   string
  productName: string
  quantity:    number
  unitPrice:   number
  notes?:      string
}

interface CartState {
  branchId: string | null
  items:    CartItem[]
}

const initialState: CartState = {
  branchId: null,
  items:    [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Adding an item — but check if it already exists first
    // This is normal JS logic inside the reducer, RTK doesn't restrict that
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        item => item.productId === action.payload.productId
      )

      if (existing) {
        // Item already in cart — just bump the quantity
        existing.quantity += action.payload.quantity
      } else {
        // New item — push it into the array
        // Again — this LOOKS like a mutation, Immer makes it safe
        state.items.push(action.payload)
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      // action.payload here is just the productId (a string)
      // filter returns a new array without the matching item
      state.items = state.items.filter(
        item => item.productId !== action.payload
      )
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        i => i.productId === action.payload.productId
      )
      if (item) {
        item.quantity = action.payload.quantity
      }
    },

    setBranch: (state, action: PayloadAction<string>) => {
      // If switching branches, clear the cart —
      // a Macchiato from Branch A might not exist at Branch B
      if (state.branchId !== action.payload) {
        state.items = []
      }
      state.branchId = action.payload
    },

    clearCart: (state) => {
      state.items = []
    },
  },
})

export const {
  addItem,
  removeItem,
  updateQuantity,
  setBranch,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer