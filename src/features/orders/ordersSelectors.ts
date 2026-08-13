import type { RootState } from '@/app/store'

// Turns the normalized { byId: {...} } object into an array,
// filtered to only "active" orders a kitchen cares about.
// IMPORTANT: 'pending' is excluded — kitchen only sees confirmed orders
// (i.e. after waiter has manually pushed them)
export const selectActiveOrders = (state: RootState) => {
  const all = Object.values(state.orders.byId)
  return all
    .filter(o => ['confirmed', 'in_kitchen', 'ready'].includes(o.status))
    .sort((a, b) => a.orderNumber.localeCompare(b.orderNumber))
}

export const selectOrderById = (orderId: string) => (state: RootState) =>
  state.orders.byId[orderId]