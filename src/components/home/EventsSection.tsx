import { Calendar } from 'lucide-react'

const EVENTS = [
  { date: 'Jul 20', title: 'Live acoustic night', desc: 'Local artists, 7–10 PM' },
  { date: 'Jul 27', title: 'Coffee cupping workshop', desc: 'Learn to taste like a pro' },
]

export default function EventsSection() {
  return (
    <section className="py-20 px-6 relative overflow-hidden bg-background">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-amber-950/15 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
          Upcoming events
        </h2>
        <div className="space-y-3">
          {EVENTS.map((e) => (
            <div
              key={e.title}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex flex-col items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Calendar size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{e.title}</p>
                <p className="text-xs mt-0.5 text-neutral-300">{e.date} — {e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}