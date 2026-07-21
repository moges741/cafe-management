import type { Middleware } from '@reduxjs/toolkit'
import { cartApi } from './cartApi'
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from './cartSlice'


export const cartSyncMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Let the reducer run first so localStorage is updated
    const result = next(action)

    const state = store.getState() as any
    if (!state.auth?.isAuthenticated) return result

    // Use `as any` on dispatch because RTK Query's initiate() returns
    // a thunk that doesn't match the default Dispatch type constraint.
    const dispatch = store.dispatch as any

    if (addItem.match(action)) {
      dispatch(
        cartApi.endpoints.addItemToCart.initiate({
          productId: action.payload.productId,
          quantity: action.payload.quantity,
          notes: action.payload.notes,
        })
      )
    } else if (removeItem.match(action)) {
      dispatch(
        cartApi.endpoints.removeCartItem.initiate(action.payload)
      )
    } else if (updateQuantity.match(action)) {
      dispatch(
        cartApi.endpoints.updateCartItem.initiate({
          productId: action.payload.productId,
          quantity: action.payload.quantity,
        })
      )
    } else if (clearCart.match(action)) {
      dispatch(
        cartApi.endpoints.clearCartApi.initiate(undefined)
      )
    }

    return result
  }