import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronDown, Check, Store, Sparkles } from 'lucide-react'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface BranchSelectorProps {
  className?: string
  variant?: 'hero' | 'compact'
}

export default function BranchSelector({ className, variant = 'hero' }: BranchSelectorProps) {
  const { branchId, setBranch, branches, isLoading } = useCurrentBranch()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter active branches
  const activeBranches = branches?.filter((b) => b.isActive) || []
  const selectedBranch = activeBranches.find((b) => b.id === branchId) || activeBranches[0]

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectBranch = (id: string, name: string) => {
    if (id === branchId) {
      setIsOpen(false)
      return
    }

    setBranch(id)
    setIsOpen(false)
    toast.success(`Location switched to ${name}. Refreshing...`, {
      icon: '📍',
      style: {
        background: '#120804',
        color: '#fff',
        border: '1px solid rgba(245, 158, 11, 0.3)',
      },
    })

    // Automatically refresh the page to reload all branch data & reset query cache
    setTimeout(() => {
      window.location.reload()
    }, 300)
  }

  if (isLoading) {
    return (
      <div className={cn('h-10 w-36 sm:w-44 rounded-2xl bg-white/5 animate-pulse border border-white/10', className)} />
    )
  }

  return (
    <div className={cn('relative inline-block text-left z-30 max-w-full', className)} ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center justify-between gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-2xl border backdrop-blur-xl transition-all duration-300 shadow-lg max-w-full',
          variant === 'hero'
            ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/20 text-white w-full sm:w-auto'
            : 'bg-white/5 border-white/10 hover:border-amber-500/40 text-neutral-200'
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 shrink-0">
            <MapPin size={13} className="fill-amber-500/30" />
          </div>

          <div className="flex flex-col text-left min-w-0">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-500/90 leading-tight">
              Branch Location
            </span>
            <span className="text-xs font-bold text-white truncate max-w-[110px] xs:max-w-[140px] sm:max-w-[180px]">
              {selectedBranch ? selectedBranch.name : 'Select Branch'}
            </span>
          </div>
        </div>

        <ChevronDown
          size={15}
          className={cn(
            'text-neutral-400 transition-transform duration-300 ml-1 shrink-0',
            isOpen && 'rotate-180 text-amber-400'
          )}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 sm:left-auto sm:right-0 md:left-0 mt-3 w-[calc(100vw-2.5rem)] sm:w-80 max-w-sm rounded-3xl bg-[#120804]/98 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden p-2 z-50"
          >
            <div className="px-4 py-3 border-b border-white/10 mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store size={14} className="text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Available Branches
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {activeBranches.length} Active
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto scrollbar-none space-y-1 py-1">
              {activeBranches.map((branch) => {
                const isSelected = branch.id === selectedBranch?.id
                return (
                  <button
                    key={branch.id}
                    onClick={() => handleSelectBranch(branch.id, branch.name)}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 text-left group',
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/30 text-white'
                        : 'hover:bg-white/5 text-neutral-300 hover:text-white border border-transparent'
                    )}
                  >
                    <div className="flex items-start gap-3 min-w-0 pr-2">
                      <div
                        className={cn(
                          'p-2 rounded-xl shrink-0 mt-0.5 transition-colors',
                          isSelected
                            ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                            : 'bg-white/5 text-neutral-400 group-hover:text-amber-400 group-hover:bg-amber-500/10'
                        )}
                      >
                        <MapPin size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold leading-snug truncate">{branch.name}</span>
                        </div>
                        {branch.address && (
                          <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                            {branch.address}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center shrink-0 ml-2 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="px-3 py-2.5 mt-1 border-t border-white/5 bg-white/[0.02] rounded-b-2xl text-[10px] text-neutral-400 flex items-center gap-1.5 justify-center text-center">
              <Sparkles size={11} className="text-amber-500 shrink-0" />
              <span>Menu items automatically refresh for your selected location</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
