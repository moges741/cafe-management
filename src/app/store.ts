import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import ordersReducer from '../features/orders/ordersSlice'
import socketReducer from '../features/socket/socketSlice'
import { baseApi } from '../lib/api'
import { socketMiddleware } from '../features/socket/socketMiddleware'

export const store = configureStore({
  reducer: {
    auth:                   authReducer,
    cart:                    cartReducer,
    orders:                  ordersReducer,
    socket:                  socketReducer,
    [baseApi.reducerPath]:   baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, socketMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch