import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import ordersReducer from '../features/orders/ordersSlice'
import socketReducer from '../features/socket/socketSlice'
import { baseApi } from '../lib/api'
import { socketMiddleware } from '../features/socket/socketMiddleware'
import { cartSyncMiddleware } from '../features/cart/cartMiddleware'
import aiChatReducer from '../features/ai/aiChatSlice'

export const store = configureStore({
  reducer: {
    auth:                   authReducer,
    cart:                    cartReducer,
    orders:                  ordersReducer,
    aiChat:                  aiChatReducer,
    socket:                  socketReducer,
    [baseApi.reducerPath]:   baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, socketMiddleware, cartSyncMiddleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch