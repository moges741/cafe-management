import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'

// configureStore combines every slice's reducer into one root reducer
// The key names here (auth, cart) become the top-level keys in your state:
// state.auth.user, state.cart.items
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
})

// ─── TypeScript types derived from the store itself ────────────────────────
// RootState = the exact shape of your entire store, auto-inferred
// This means if you add a new slice later, RootState updates automatically —
// you never manually maintain this type
export type RootState = ReturnType<typeof store.getState>

// AppDispatch = the exact type of the dispatch function for this store
// Needed for TypeScript to know what dispatch() accepts
export type AppDispatch = typeof store.dispatch