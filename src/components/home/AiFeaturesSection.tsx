import { motion } from 'framer-motion'
import { Mic, Sparkles, Zap } from 'lucide-react'

const AI_FEATURES = [
  { icon: Mic, title: 'Order by voice', desc: 'Just speak — no typing, no menus' },
  { icon: Sparkles, title: 'Understands you', desc: 'English, Amharic, Afaan Oromo' },
  { icon: Zap, title: 'Instant to kitchen', desc: 'Confirmed → in your kitchen in seconds' },
]

export default function AiFeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-card to-background border-y border-border relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-amber-900/20 rounded-full blur-[120px]"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs uppercase tracking-[0.2em] text-primary mb-4"
        >
          Powered by AI
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-foreground mb-6"
        >
          Ordering, reimagined
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm max-w-lg mx-auto mb-14 text-neutral-300"
        >
          Look for the assistant button floating in the corner — talk to it like you would a barista.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {AI_FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -12 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md transition-all duration-300 group-hover:border-amber-500/30 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4"
                >
                  <feature.icon size={22} className="text-primary" />
                </motion.div>

                <p className="text-base font-semibold text-foreground mb-2">{feature.title}</p>
                <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                  {feature.desc}
                </p>

                {/* Animated border bottom */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400/50 to-transparent"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}