import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.5 })

  const textVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05,
      },
    }),
  }

  // Split text into words for word-by-word animation
  const words = [
    'Where',
    'every',
    'cup',
    'tells',
    'a',
    'story.',
    'Mr.',
    'Cafe',
    'started',
    'with',
    'a',
    'simple',
    'idea',
    '—',
    'good',
    'coffee',
    "shouldn't",
    'be',
    'complicated.',
  ]

  return (
    <section ref={ref} className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-amber-950/20 blur-[120px] pointer-events-none" />

      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-10 right-10 w-32 h-32 border border-primary/10 rounded-full"
      />

      <div className="max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs uppercase tracking-[0.2em] text-primary mb-4"
        >
          Our story
        </motion.p>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              custom={i}
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className={`text-3xl md:text-5xl font-bold leading-tight ${
                i < 6 ? 'text-foreground' : 'text-primary/70'
              }`}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-sm leading-relaxed max-w-lg mx-auto text-neutral-300"
        >
          From our roastery to your table, every bean, every plate, and every order is
          handled with care. We blend warmth with modern technology — real-time tracking,
          AI-assisted ordering, and a kitchen that never keeps you guessing.
        </motion.p>
      </div>
    </section>
  )
}