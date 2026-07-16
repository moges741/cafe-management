import { Mic, Sparkles, Zap } from 'lucide-react'

const AI_FEATURES = [
  { icon: Mic,       title: 'Order by voice',    desc: 'Just speak your order — no typing, no menus to scroll' },
  { icon: Sparkles,  title: 'Understands you',   desc: 'Ask in English, Amharic, or Afaan Oromo — it adapts' },
  { icon: Zap,       title: 'Instant to kitchen', desc: 'Your AI order hits the kitchen the moment it\'s confirmed' },
]

export default function AiFeaturesSection() {
  return (
    <section className="py-20 px-6 bg-card border-y border-border">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Powered by AI</p>
        <h2 className="text-3xl font-bold text-foreground mb-4">Ordering, reimagined</h2>
        <p className="text-sm max-w-lg mx-auto mb-12" style={{ color: '#B58B67' }}>
          Look for the assistant button in the corner of every page — talk to it like you would a barista.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {AI_FEATURES.map((f) => (
            <div key={f.title} className="bg-background border border-primary/30 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <f.icon size={20} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">{f.title}</p>
              <p className="text-xs mt-1.5" style={{ color: '#B58B67' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}