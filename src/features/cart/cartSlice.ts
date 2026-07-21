import { createSlice, } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { cartApi } from './cartApi'

export interface CartItem {
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

const loadState = (): CartState => {
  try {
    const serializedState = localStorage.getItem('mr_cafe_cart')
    if (serializedState === null) {
      return { branchId: null, items: [] }
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return { branchId: null, items: [] }
  }
}

const saveState = (state: CartState) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('mr_cafe_cart', serializedState)
  } catch {
    // ignore write errors
  }
}

const initialState: CartState = loadState()

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
      saveState(state)
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        item => item.productId === action.payload.productId
      )
      if (existing) {
        existing.quantity += action.payload.quantity
        if (action.payload.notes) existing.notes = action.payload.notes
      } else {
        state.items.push(action.payload)
      }
      saveState(state)
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item.productId !== action.payload
      )
      saveState(state)
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
      saveState(state)
    },
    setBranch: (state, action: PayloadAction<string>) => {
      if (state.branchId !== action.payload) {
        state.items = []
      }
      state.branchId = action.payload
      saveState(state)
    },
    clearCart: (state) => {
      state.items = []
      saveState(state)
    },
  },
  extraReducers: (builder) => {
    // When backend returns cart, we update our local state to match
    builder.addMatcher(
      cartApi.endpoints.getCart.matchFulfilled,
      (state, { payload }) => {
        state.items = payload.items.map(item => ({
          productId: item.productId,
          productName: item.productName || 'Unknown Product',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes
        }))
        saveState(state)
      }
    )
  }
})

export const {
  setCart,
  addItem,
  removeItem,
  updateQuantity,
  setBranch,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer