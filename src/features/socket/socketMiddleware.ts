import type { Middleware } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { getSocket } from '@/lib/socket'
import { setConnected, roomJoined } from './socketSlice'
import { upsertOrder, updateOrderStatus } from '../orders/ordersSlice'

// Action creators for things a COMPONENT can dispatch to control the socket.
// These are plain actions — the middleware below intercepts them and
// performs the actual side effect (connecting, joining a room, etc)
export const socketActions = {
  connect:        () => ({ type: 'socket/connectRequested' as const }),
  joinKitchen:    (branchId: string) => ({ type: 'socket/joinKitchen' as const, payload: branchId }),
  joinOrderRoom:  (orderId: string)  => ({ type: 'socket/joinOrder' as const, payload: orderId }),
}


export const socketMiddleware: Middleware = (store) => {
  const socket = getSocket()
  let listenersAttached = false

  // Attach Socket.io event listeners exactly once —
  // these translate raw server events into Redux dispatches
  function attachListeners() {
    if (listenersAttached) return
    listenersAttached = true

    socket.on('connect', () => {
      store.dispatch(setConnected(true))
    })

    socket.on('disconnect', () => {
      store.dispatch(setConnected(false))
    })

    // Kitchen sees a brand new order
    socket.on('kitchen.new_order', (payload: any) => {
      const order = payload.data
      store.dispatch(upsertOrder({
        id:          order.id,
        orderNumber: order.orderNumber,
        status:      order.status,
        branchId:    order.branchId,
      }))
      toast.success(`New order: ${order.orderNumber}`)
    })

    // Any order's status changed — kitchen board AND customer tracker
    // both listen for this same event
    socket.on('order.status.updated', (payload: any) => {
      const data = payload.data
      store.dispatch(updateOrderStatus({
        orderId: data.orderId,
        status:  data.status,
      }))
    })

    socket.on('kitchen.order_update', (payload: any) => {
      const data = payload.data
      store.dispatch(updateOrderStatus({
        orderId: data.orderId,
        status:  data.status,
      }))
    })

    // Manager low-stock alerts etc
    socket.on('notification', (payload: any) => {
      toast(payload.message, { icon: '🔔' })
    })
    }

  // This returned function runs for EVERY action dispatched in the app
  return (next) => (action: any) => {
    switch (action.type) {
      case 'socket/connectRequested':
        attachListeners()
        if (!socket.connected) socket.connect()
        break

      case 'socket/joinKitchen':
        socket.emit('kitchen.join', { branchId: action.payload }, () => {
          store.dispatch(roomJoined(`kitchen:${action.payload}`))
        })
        break

      case 'socket/joinOrder':
        socket.emit('order.join', { orderId: action.payload }, () => {
          store.dispatch(roomJoined(`order:${action.payload}`))
        })
        break
    }

    // Always call next() — this passes the action forward so
    // reducers still process it normally. Forgetting this line
    // is the most common middleware bug — it silently breaks
    // every other action in the app.
    return next(action)
  }
}