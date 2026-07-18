import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  { q: 'Do you deliver?', a: 'Yes, through the app for all branches within city limits.' },
  { q: 'Can I pay with Telebirr or CBE Birr?', a: 'Yes, via Chapa at checkout, plus cash on pickup or delivery.' },
  { q: 'Is the AI assistant available in Amharic?', a: 'Yes for typed messages — voice input currently works best in English.' },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-20 px-6 relative overflow-hidden bg-background">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-amber-950/15 blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
          Frequently asked
        </h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/20 transition-all duration-300">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground text-left"
              >
                {faq.q}
                <ChevronDown size={16} className={cn('transition-transform', open === i && 'rotate-180')} />
              </button>
              {open === i && (
                <p className="px-4 pb-3 text-xs text-neutral-300">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}