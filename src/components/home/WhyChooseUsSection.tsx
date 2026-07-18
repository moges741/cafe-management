import { motion } from 'framer-motion'
import { useRef } from 'react'
import {
  Coffee,
  Salad,
  Truck,
  Wifi,
  Armchair,
  CreditCard,
} from 'lucide-react'

const FEATURES = [
  { icon: Coffee, title: 'Premium coffee beans', desc: 'Ethically sourced, freshly roasted' },
  { icon: Salad, title: 'Fresh ingredients', desc: 'Locally sourced, no shortcuts' },
  { icon: Truck, title: 'Fast delivery', desc: 'Hot food, fast — every time' },
  { icon: Wifi, title: 'Free WiFi', desc: 'Work, study, or relax' },
  { icon: Armchair, title: 'Comfortable workspace', desc: 'Designed for long afternoons' },
  { icon: CreditCard, title: 'Cashless payment', desc: 'Chapa, card, or cash' },
]

export default function WhyChooseUsSection() {
  const sectionRef = useRef(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 bg-gradient-to-b from-background via-card to-background border-y border-border relative overflow-hidden"
    >
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-amber-950/15 blur-[150px] pointer-events-none" />

      <motion.div className="max-w-5xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500"
        >
          Why choose us
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, threshold: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* Icon with animation */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4 relative z-10"
              >
                <feature.icon size={20} className="text-primary" />
              </motion.div>

              <p className="text-base font-semibold text-foreground mb-2 relative z-10">
                {feature.title}
              </p>
              <p className="text-sm relative z-10 text-neutral-300">
                {feature.desc}
              </p>

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-2xl border border-amber-500"
                style={{
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
                whileHover={{ opacity: 0.5 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}