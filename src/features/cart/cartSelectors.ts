import type { RootState } from '@/app/store'

// A selector is just a function that takes state and returns derived data
// It doesn't live IN the slice — reducers only describe how to change state,
// selectors describe how to READ/COMPUTE from it
export const selectCartItems = (state: RootState) => state.cart.items

export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

export const selectCartItemCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

export const selectCartBranchId = (state: RootState) => state.cart.branchId