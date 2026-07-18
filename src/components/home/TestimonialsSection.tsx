// src/components/home/TestimonialsSection.tsx
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  { name: 'Selam T.', text: 'Best macchiato in Addis, hands down. The AI ordering thing is actually really smooth too.', rating: 5 },
  { name: 'Dawit K.',  text: 'I work from here twice a week. WiFi is solid, staff remembers my order.', rating: 5 },
  { name: 'Marta B.',  text: 'Delivery was faster than I expected and everything arrived hot.', rating: 4 },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-6 relative overflow-hidden bg-background">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] rounded-full bg-amber-950/15 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
          What people say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:border-amber-500/25 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300 group"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={13} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed">"{t.text}"</p>
              <p className="text-xs mt-3 text-neutral-300">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}