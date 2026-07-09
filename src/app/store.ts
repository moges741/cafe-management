import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import { baseApi } from '../lib/api'

export const store = configureStore({
  reducer: {
    auth:            authReducer,
    cart:             cartReducer,
    [baseApi.reducerPath]: baseApi.reducer, // RTK Query's own slice — caches all API data
  },
  // This middleware powers caching, invalidation, polling, and refetch-on-focus
  // Without it, RTK Query's hooks (useLoginMutation etc) simply won't work
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch