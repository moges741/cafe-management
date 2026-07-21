import { useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { useGetMeQuery } from './authApi'
import { setUser, clearUser } from './authSlice'
import { socketActions } from '@/features/socket/socketMiddleware'
import { motion } from 'framer-motion'

export default function SessionInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { data, isLoading, isError } = useGetMeQuery()

  useEffect(() => {
    if (isLoading) return

    if (data) {
      dispatch(setUser(data))
    } else if (isError) {
      dispatch(clearUser())
    }

    // Connect the socket regardless of guest/logged-in —
    // guests can still track an order they just placed
    dispatch(socketActions.connect())
  }, [data, isLoading, isError, dispatch])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] min-h-screen flex flex-col items-center justify-center bg-[#050301] overflow-hidden selection:bg-amber-500/30">
        
        {/* Ambient Pulsing Glow Behind the Cup */}
        <motion.div
          className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-amber-700/10 rounded-full blur-[120px] pointer-events-none"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col items-center">
          
          {/* Rising Steam Particles */}
          <div className="relative w-full h-16 flex justify-center gap-3 mb-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-white/20 rounded-full blur-[3px]"
                animate={{
                  y: [10, -40],
                  opacity: [0, 0.7, 0],
                  scaleX: [1, 2, 1],
                  scaleY: [1, 1.5, 1],
                  rotate: [0, i % 2 === 0 ? 15 : -15, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Premium Glass Container */}
          <div className="relative w-20 h-28 border-[3px] border-white/10 border-t-white/5 rounded-b-[2.5rem] rounded-t-lg bg-white/[0.02] backdrop-blur-md overflow-hidden flex items-end shadow-[0_0_40px_rgba(245,158,11,0.05)]">
            
            {/* Dynamic Brewing Liquid */}
            <motion.div
              className="w-full relative bg-gradient-to-t from-[#4a260a] via-[#803a08] to-[#d67600] rounded-b-[2.2rem]"
              animate={{
                height: ['15%', '85%', '15%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Liquid Surface Crema / Reflection */}
              <motion.div 
                className="absolute top-0 left-0 right-0 h-3 bg-amber-300/40 rounded-[50%] blur-[1px] transform -translate-y-1/2"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            
            {/* Glass Edge Highlight */}
            <div className="absolute inset-y-3 left-2 w-1.5 rounded-full bg-gradient-to-b from-white/30 to-transparent blur-[1px]" />
            <div className="absolute inset-y-6 right-2 w-0.5 rounded-full bg-white/10 blur-[1px]" />
          </div>

          {/* Subtle Saucer / Coaster shadow */}
          <div className="w-24 h-2 bg-white/10 rounded-[50%] mt-4 blur-[2px] shadow-[0_0_20px_rgba(245,158,11,0.3)]" />

          {/* Typography */}
          <div className="mt-10 flex flex-col items-center">
            <span className="text-amber-500/70 text-[10px] font-bold tracking-[0.4em] uppercase mb-3">
              Mr. Cafe
            </span>
            <motion.h2 
              className="text-lg md:text-xl font-medium text-white tracking-widest flex items-center gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Brewing Experience
              <span className="flex gap-0.5 ml-1">
                <motion.span animate={{ opacity: [0,1,0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
                <motion.span animate={{ opacity: [0,1,0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>.</motion.span>
                <motion.span animate={{ opacity: [0,1,0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}>.</motion.span>
              </span>
            </motion.h2>
          </div>

        </div>
      </div>
    )
  }

  return <>{children}</>
}