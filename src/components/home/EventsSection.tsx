import { Calendar } from 'lucide-react'

const EVENTS = [
  { date: 'Jul 20', title: 'Live acoustic night', desc: 'Local artists, 7–10 PM' },
  { date: 'Jul 27', title: 'Coffee cupping workshop', desc: 'Learn to taste like a pro' },
]

export default function EventsSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-center mb-10">Upcoming events</h2>
        <div className="space-y-3">
          {EVENTS.map((e) => (
            <div key={e.title} className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex flex-col items-center justify-center shrink-0">
                <Calendar size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{e.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#B58B67' }}>{e.date} — {e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}