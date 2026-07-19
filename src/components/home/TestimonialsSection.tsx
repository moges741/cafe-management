"use client";

import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

const TESTIMONIALS = [
  { 
    name: 'Selam T.', 
    role: 'Local Guide', 
    text: 'Best macchiato in Addis, hands down. The AI ordering thing is actually really smooth too.', 
    rating: 5,
    gradient: 'from-amber-400 to-orange-600'
  },
  { 
    name: 'Dawit K.',  
    role: 'Remote Worker', 
    text: 'I work from here twice a week. WiFi is solid, staff remembers my order every single time.', 
    rating: 5,
    gradient: 'from-blue-400 to-emerald-500'
  },
  { 
    name: 'Marta B.',  
    role: 'Coffee Enthusiast', 
    text: 'Delivery was faster than I expected and everything arrived hot. The packaging is premium!', 
    rating: 4,
    gradient: 'from-purple-400 to-pink-600'
  },
]

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-[#050301]">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-amber-900/10 blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-950/15 blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Star size={12} className="fill-amber-500" /> Reviews
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Loved by <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              coffee lovers.
            </span>
          </h2>
          <p className="text-neutral-400 font-medium max-w-xl mx-auto">
            Don't just take our word for it. Here is what our community has to say about their Mr. Cafe experience.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              variants={cardVariants}
              key={t.name}
              className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 backdrop-blur-xl hover:border-amber-500/30 hover:bg-white/[0.04] transition-all duration-500 group relative overflow-hidden flex flex-col"
            >
              {/* Decorative Quote Watermark */}
              <Quote 
                size={120} 
                className="absolute -top-6 -right-6 text-white/[0.03] group-hover:text-amber-500/[0.05] transition-colors duration-500 -rotate-12 pointer-events-none" 
              />
              
              {/* Hover Glow inside card */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[40px] bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Rating */}
              <div className="flex gap-1 mb-6 relative z-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < t.rating ? "fill-amber-500 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "fill-neutral-800 text-neutral-800"} 
                  />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-base text-neutral-200 leading-relaxed font-medium mb-8 relative z-10 flex-grow">
                "{t.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 relative z-10 mt-auto pt-6 border-t border-white/5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${t.gradient} shadow-lg shrink-0`}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-tight">{t.name}</p>
                  <p className="text-xs text-neutral-500 font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}