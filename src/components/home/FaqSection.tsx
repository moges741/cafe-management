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
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-center mb-10">Frequently asked</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground text-left"
              >
                {faq.q}
                <ChevronDown size={16} className={cn('transition-transform', open === i && 'rotate-180')} />
              </button>
              {open === i && (
                <p className="px-4 pb-3 text-xs" style={{ color: '#B58B67' }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}