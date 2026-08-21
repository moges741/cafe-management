import type { Middleware } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { getSocket } from '@/lib/socket'
import { setConnected, roomJoined } from './socketSlice'
import { upsertOrder, updateOrderStatus, updateOrderPayment } from '../orders/ordersSlice'
import { ordersApi } from '../orders/ordersApi'
import { baseApi } from '@/lib/api'

export const socketActions = {
  connect:        () => ({ type: 'socket/connectRequested' as const }),
  joinKitchen:    (branchId: string) => ({ type: 'socket/joinKitchen' as const, payload: branchId }),
  joinOrderRoom:  (orderId: string)  => ({ type: 'socket/joinOrder' as const, payload: orderId }),
}

export const socketMiddleware: Middleware = (store) => {
  const socket = getSocket()
  let listenersAttached = false
  let activeBranchId: string | null = null
  const activeOrderIds = new Set<string>()

  function attachListeners() {
    if (listenersAttached) return
    listenersAttached = true

    socket.on('connect', () => {
      store.dispatch(setConnected(true))
      // Re-fetch authoritative state upon reconnection to recover missed events during offline period
      store.dispatch(baseApi.util.invalidateTags(['Order', 'Product', 'Inventory', 'Category']))

      // Re-subscribe to active rooms upon socket reconnect
      if (activeBranchId) {
        socket.emit('kitchen.join', { branchId: activeBranchId }, () => {
          store.dispatch(roomJoined(`kitchen:${activeBranchId}`))
        })
      }
      activeOrderIds.forEach((orderId) => {
        socket.emit('order.join', { orderId }, () => {
          store.dispatch(roomJoined(`order:${orderId}`))
        })
      })
    })

    socket.on('disconnect', (reason) => {
      store.dispatch(setConnected(false))
      if (reason === 'io server disconnect' && navigator.onLine) {
        socket.connect()
      }
    })

    // Network offline/online window listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('offline', () => {
        store.dispatch(setConnected(false))
      })
      window.addEventListener('online', () => {
        if (!socket.connected) {
          socket.connect()
        }
      })
    }

    socket.on('kitchen.new_order', (payload: any) => {
      const order = payload.data
      store.dispatch(upsertOrder({
        id:          order.id,
        orderNumber: order.orderNumber,
        status:      order.status,
        branchId:    order.branchId,
        createdAt:   order.createdAt,
        payment:     order.payment,
        items:       order.items,
        type:        order.type,
        tableNumber: order.tableNumber
      }))
      store.dispatch(ordersApi.util.invalidateTags(['Order']))
      toast.success(`New order: ${order.orderNumber}`)
    })

    socket.on('order.status.updated', (payload: any) => {
      const data = payload.data
      store.dispatch(updateOrderStatus({
        orderId: data.orderId,
        status:  data.status,
      }))
      if (data.payment) {
        store.dispatch(updateOrderPayment({ orderId: data.orderId, payment: data.payment }))
      }
      store.dispatch(ordersApi.util.invalidateTags(['Order']))
    })

    socket.on('kitchen.order_update', (payload: any) => {
      const data = payload.data
      store.dispatch(updateOrderStatus({
        orderId: data.orderId,
        status:  data.status,
      }))
      if (data.payment) {
        const wasUnpaid = !store.getState().orders.byId[data.orderId]?.payment?.status
          || store.getState().orders.byId[data.orderId]?.payment?.status === 'pending'
        store.dispatch(updateOrderPayment({ orderId: data.orderId, payment: data.payment }))
        if (data.payment.method === 'chapa' && data.payment.status === 'completed' && wasUnpaid) {
          toast.success(`Order paid via Chapa — ready for kitchen!`, { icon: '✅' })
        }
      }
      store.dispatch(ordersApi.util.invalidateTags(['Order']))
    })

    socket.on('notification', (payload: any) => {
      toast(payload.message, { icon: '🔔' })
    })
  }

  return (next) => (action: any) => {
    switch (action.type) {
      case 'socket/connectRequested':
        attachListeners()
        if (!socket.connected && (typeof window === 'undefined' || navigator.onLine)) {
          socket.connect()
        }
        break

      case 'socket/joinKitchen':
        activeBranchId = action.payload
        if (socket.connected) {
          socket.emit('kitchen.join', { branchId: action.payload }, () => {
            store.dispatch(roomJoined(`kitchen:${action.payload}`))
          })
        }
        break

      case 'socket/joinOrder':
        activeOrderIds.add(action.payload)
        if (socket.connected) {
          socket.emit('order.join', { orderId: action.payload }, () => {
            store.dispatch(roomJoined(`order:${action.payload}`))
          })
        }
        break
    }

    return next(action)
  }
}