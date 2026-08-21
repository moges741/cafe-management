import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { useAppSelector } from '@/app/hooks'
import { WifiOff, RefreshCw } from 'lucide-react'

interface PwaNetworkBannerProps {
  moduleName?: string
  cachedItemsLabel?: string
  networkRequiredLabel?: string
}

export default function PwaNetworkBanner({
  moduleName = 'Staff Portal',
  cachedItemsLabel = 'Dashboard metrics & catalog',
  networkRequiredLabel = 'Mutations, payments & status updates',
}: PwaNetworkBannerProps) {
  const { isOnline } = useNetworkStatus()
  const socketConnected = useAppSelector((state) => state.socket.connected)

  if (isOnline && socketConnected) return null

  return (
    <div className="w-full mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl text-amber-300 text-xs md:text-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
      <div className="flex items-start md:items-center gap-3">
        <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 shrink-0 mt-0.5 md:mt-0">
          {!isOnline ? <WifiOff size={18} className="animate-pulse" /> : <RefreshCw size={18} className="animate-spin" />}
        </div>
        <div>
          <div className="font-bold flex items-center gap-2">
            <span>{!isOnline ? 'Offline Mode' : 'Connecting to Live Events...'}</span>
            <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 font-extrabold">
              {moduleName}
            </span>
          </div>
          <p className="text-neutral-400 text-xs mt-0.5">
            {!isOnline
              ? `Displaying cached snapshot for ${cachedItemsLabel.toLowerCase()}. ${networkRequiredLabel} require internet connection.`
              : 'Re-establishing real-time socket sync...'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 shrink-0 self-start md:self-auto">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        <span>{!isOnline ? 'Cached Snapshot Active' : 'Re-syncing'}</span>
      </div>
    </div>
  )
}
