import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

/** Generic shimmer skeleton block — matches Golden Espresso dark palette */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-white/[0.06] relative overflow-hidden',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent',
        'before:animate-[shimmer_1.6s_infinite]',
        className
      )}
    />
  )
}

/** Row of skeleton text lines, useful for cards/lists */
export function SkeletonText({ lines = 2, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

/** Product / menu card skeleton — matches the 4/5 aspect cards on MenuPage */
export function SkeletonMenuCard() {
  return (
    <div className="aspect-[4/5] rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden relative">
      <Skeleton className="absolute inset-0 rounded-[32px]" />
      {/* Bottom content area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-5 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-20 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

/** Metric / stat card skeleton — matches AdminDashboardPage cards */
export function SkeletonMetricCard() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-xl space-y-6">
      <div className="flex justify-between items-start">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="h-10 w-1/2" />
    </div>
  )
}

/** Order row skeleton — matches the order list in OrdersPage / WaiterIncomingOrders */
export function SkeletonOrderRow() {
  return (
    <div className="h-28 bg-white/[0.02] backdrop-blur-md rounded-[24px] border border-white/10 p-5 flex items-center gap-5">
      <Skeleton className="h-14 w-14 rounded-2xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-9 w-28 rounded-xl" />
    </div>
  )
}

/** Kitchen history table row skeleton */
export function SkeletonTableRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

export default Skeleton
