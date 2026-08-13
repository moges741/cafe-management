import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Coffee, Home, ChevronRight, CornerDownLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#050301] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-amber-500/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-amber-950/15 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[10%] right-[10%] w-[30vw] h-[30vw] bg-orange-950/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[10%] left-[10%] w-[40vw] h-[40vw] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 max-w-lg w-full text-center flex flex-col items-center">
        {/* Animated Coffee Cup Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="relative w-48 h-48 flex items-center justify-center mb-8"
        >
          {/* Steam Elements */}
          <div className="absolute top-4 flex gap-3 justify-center w-full">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-8 bg-gradient-to-t from-amber-500/80 to-transparent rounded-full"
                initial={{ opacity: 0, y: 10, scaleY: 0.5 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  y: [-10, -35],
                  scaleY: [0.5, 1.2, 0.8],
                  scaleX: [1, 0.8, 1.2],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Golden Cup Silhouette with Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-white/10 rounded-[40px] backdrop-blur-md shadow-2xl flex items-center justify-center p-6 group hover:border-amber-500/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[40px] pointer-events-none" />
            <motion.div
              animate={{ rotate: [0, -2, 2, -2, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="text-amber-500 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            >
              <Coffee size={80} strokeWidth={1} />
            </motion.div>
          </div>

          {/* Large Floating "404" Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute -bottom-4 bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent text-6xl font-black tracking-tighter drop-shadow-2xl select-none"
          >
            404
          </motion.div>
        </motion.div>

        {/* Text Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            This cup is <br className="xs:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500">
              entirely empty.
            </span>
          </h1>
          <p className="text-neutral-400 font-medium text-base md:text-lg max-w-sm mx-auto leading-relaxed">
            The page you are looking for has been moved, brewed, or never existed in our system. Let's get you back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full mt-10"
        >
          <Link
            to="/menu"
            className="flex-1 h-12 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-all group flex items-center justify-center gap-2"
          >
            Explore Our Menu
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/"
            className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-bold rounded-xl backdrop-blur-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Home size={16} className="text-amber-500" />
            Back to Home
          </Link>
        </motion.div>

        {/* Go Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 0.9 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-xs text-neutral-500 font-medium"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 hover:underline"
          >
            <CornerDownLeft size={12} />
            Go back to where you were
          </button>
        </motion.div>
      </div>
    </div>
  )
}
