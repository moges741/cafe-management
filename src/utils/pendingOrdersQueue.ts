export interface QueuedOrderItem {
  productId: string
  productName?: string
  quantity: number
  unitPrice?: number
  notes?: string
}

export interface QueuedOrder {
  idempotencyKey: string
  branchId: string
  type: 'dine_in' | 'takeaway'
  tableNumber?: number
  notes?: string
  items: QueuedOrderItem[]
  createdAt: string
  syncStatus: 'pending_sync' | 'syncing' | 'sync_failed'
  syncError?: string
}

const QUEUE_STORAGE_KEY = 'mr_cafe_pending_orders_queue'

export function getPendingOrders(): QueuedOrder[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePendingOrders(queue: QueuedOrder[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue))
  } catch {}
}

export function enqueuePendingOrder(order: Omit<QueuedOrder, 'idempotencyKey' | 'createdAt' | 'syncStatus'>): QueuedOrder {
  const queue = getPendingOrders()
  const newOrder: QueuedOrder = {
    ...order,
    idempotencyKey: `client_ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    syncStatus: 'pending_sync',
  }
  queue.push(newOrder)
  savePendingOrders(queue)
  return newOrder
}

export function removePendingOrder(idempotencyKey: string): void {
  const queue = getPendingOrders().filter((o) => o.idempotencyKey !== idempotencyKey)
  savePendingOrders(queue)
}

export function updatePendingOrderState(idempotencyKey: string, status: QueuedOrder['syncStatus'], error?: string): void {
  const queue = getPendingOrders().map((o) => {
    if (o.idempotencyKey === idempotencyKey) {
      return { ...o, syncStatus: status, syncError: error }
    }
    return o
  })
  savePendingOrders(queue)
}
