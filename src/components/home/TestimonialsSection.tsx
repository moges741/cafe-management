// src/components/home/TestimonialsSection.tsx
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  { name: 'Selam T.', text: 'Best macchiato in Addis, hands down. The AI ordering thing is actually really smooth too.', rating: 5 },
  { name: 'Dawit K.',  text: 'I work from here twice a week. WiFi is solid, staff remembers my order.', rating: 5 },
  { name: 'Marta B.',  text: 'Delivery was faster than I expected and everything arrived hot.', rating: 4 },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-center mb-10">What people say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={13} className="fill-primary text-primary" />)}
              </div>
              <p className="text-sm text-foreground leading-relaxed">"{t.text}"</p>
              <p className="text-xs mt-3" style={{ color: '#B58B67' }}>{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}