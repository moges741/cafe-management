// import { useEffect, useRef, useState } from 'react'
// import { motion, useInView } from 'framer-motion'

// interface Stat {
//   value: number
//   label: string
//   suffix?: string
// }

// const STATS: Stat[] = [
//   { value: 15, label: 'Happy customers', suffix: 'K+' },
//   { value: 49, label: 'Average rating', suffix: '/50' },
//   { value: 50, label: 'Menu items', suffix: '+' },
//   { value: 3, label: 'Branches' },
// ]

// function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
//   const [count, setCount] = useState(0)
//   const ref = useRef(null)
//   const isInView = useInView(ref, { once: true, threshold: 0.5 })

//   useEffect(() => {
//     if (!isInView) return

//     const start = 0
//     const end = value
//     const duration = 2.5
//     const increment = end / (duration * 60)
//     let current = start

//     const timer = setInterval(() => {
//       current += increment
//       if (current >= end) {
//         setCount(end)
//         clearInterval(timer)
//       } else {
//         setCount(Math.floor(current))
//       }
//     }, 1000 / 60)

//     return () => clearInterval(timer)
//   }, [isInView, value])

//   return (
//     <span ref={ref}>
//       {count}
//       {suffix}
//     </span>
//   )
// }

// export default function StatsSection() {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.15,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: { duration: 0.6, ease: 'easeOut' },
//     },
//   }

//   return (
//     <section className="py-20 px-6 border-y border-border bg-gradient-to-b from-card to-background relative overflow-hidden">
//       {/* Ambient Glow */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-amber-950/15 blur-[120px] pointer-events-none" />

//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, threshold: 0.3 }}
//         className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10"
//       >
//         {STATS.map((stat) => (
//           <motion.div
//             key={stat.label}
//             variants={itemVariants}
//             className="relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden group transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
//           >
//             {/* Background glow on hover */}
//             <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//             {/* Content */}
//             <div className="relative z-10">
//               <p className="text-4xl md:text-5xl font-bold text-amber-400">
//                 <AnimatedCounter value={stat.value} suffix={stat.suffix} />
//               </p>
//               <p className="text-xs uppercase tracking-wider mt-2 text-neutral-300">
//                 {stat.label}
//               </p>
//             </div>

//             {/* Animated border on hover */}
//             <motion.div
//               className="absolute inset-0 border-2 border-amber-500 rounded-2xl"
//               initial={{ pathLength: 0 }}
//               whileHover={{ pathLength: 1 }}
//               transition={{ duration: 0.6 }}
//               style={{ opacity: 0.5 }}
//             />
//           </motion.div>
//         ))}
//       </motion.div>
//     </section>
//   )
// }