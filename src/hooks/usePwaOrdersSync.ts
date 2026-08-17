import { useEffect, useState, useCallback } from 'react'
import { useCreateOrderMutation } from '@/features/orders/ordersApi'
import { useNetworkStatus } from './useNetworkStatus'
import {
  getPendingOrders,
  removePendingOrder,
  updatePendingOrderState,
  type QueuedOrder,
} from '@/utils/pendingOrdersQueue'
import toast from 'react-hot-toast'

export function usePwaOrdersSync() {
  const { isOnline } = useNetworkStatus()
  const [createOrder] = useCreateOrderMutation()
  const [pendingOrders, setPendingOrders] = useState<QueuedOrder[]>([])
  const [isSyncing, setIsSyncing] = useState(false)

  const refreshPendingQueue = useCallback(() => {
    setPendingOrders(getPendingOrders())
  }, [])

  const syncQueue = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return
    const queue = getPendingOrders()
    if (queue.length === 0) return

    setIsSyncing(true)

    for (const pendingOrder of queue) {
      if (pendingOrder.syncStatus === 'syncing') continue

      updatePendingOrderState(pendingOrder.idempotencyKey, 'syncing')
      refreshPendingQueue()

      try {
        const created = await createOrder({
          branchId: pendingOrder.branchId,
          type: pendingOrder.type,
          tableNumber: pendingOrder.tableNumber,
          notes: pendingOrder.notes,
          items: pendingOrder.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            notes: i.notes,
          })),
        }).unwrap()

        removePendingOrder(pendingOrder.idempotencyKey)
        toast.success(`Queued Order #${created.orderNumber || 'new'} synced with server!`, {
          icon: '⚡',
        })
      } catch (err: any) {
        const errorMsg =
          err?.data?.error?.message ?? err?.data?.message ?? 'Sync failed due to server validation'
        updatePendingOrderState(pendingOrder.idempotencyKey, 'sync_failed', errorMsg)
        toast.error(`Order sync failed: ${errorMsg}`)
      }
    }

    setIsSyncing(false)
    refreshPendingQueue()
  }, [isSyncing, createOrder, refreshPendingQueue])

  useEffect(() => {
    refreshPendingQueue()
  }, [refreshPendingQueue])

  useEffect(() => {
    if (isOnline) {
      syncQueue()
    }
  }, [isOnline, syncQueue])

  return {
    isOnline,
    pendingOrders,
    isSyncing,
    syncQueue,
    refreshPendingQueue,
  }
}
