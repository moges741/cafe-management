import { Calendar, Users, ArrowUpRight, Sparkles } from 'lucide-react'

const TEAM = [
  { name: 'Moges', role: 'Founder & Head Roaster', initials: 'M' },
  { name: 'Selamawit', role: 'Head Chef', initials: 'S' },
  { name: 'Yonas', role: 'Operations Lead', initials: 'Y' },
]

const EVENTS = [
  {
    date: 'Jul 20',
    title: 'Live Acoustic Night',
    desc: 'Local artists & warm brews, 7–10 PM',
    tag: 'Music',
  },
  {
    date: 'Jul 27',
    title: 'Coffee Cupping Workshop',
    desc: 'Learn to taste specialty roasts like a pro',
    tag: 'Workshop',
  },
]

export default function TeamAndEventsSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-background border-y border-border/60">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            <span>Community & Culture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            The Heart Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">Mr. Cafe</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base leading-relaxed">
            Crafted by passionate artisans and brought alive through vibrant local gatherings.
          </p>
        </div>

        {/* Combined Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: MEET THE TEAM (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Users size={18} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Meet the Team</h3>
              </div>
              <span className="text-xs text-muted-foreground font-medium">3 Artisans</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TEAM.map((member) => (
                <div
                  key={member.name}
                  className="group relative bg-card/40 border border-border/60 hover:border-amber-500/40 rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/5 text-center flex flex-col items-center justify-center"
                >
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl group-hover:scale-105 group-hover:border-amber-400 transition-all duration-300 shadow-inner">
                      {member.initials}
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-foreground group-hover:text-amber-400 transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 font-medium leading-snug">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: UPCOMING EVENTS (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Calendar size={18} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Upcoming Events</h3>
              </div>
              <span className="text-xs text-amber-400 font-medium hover:underline cursor-pointer flex items-center gap-1">
                View All <ArrowUpRight size={12} />
              </span>
            </div>

            <div className="space-y-4">
              {EVENTS.map((e) => {
                const [month, day] = e.date.split(' ')
                return (
                  <div
                    key={e.title}
                    className="group relative bg-card/40 border border-border/60 hover:border-amber-500/40 rounded-2xl p-4 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 flex items-start gap-4"
                  >
                    {/* Date Badge */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/5 border border-amber-500/20 flex flex-col items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-amber-500/40 transition-all duration-300">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-tight">
                        {month}
                      </span>
                      <span className="text-base font-extrabold text-foreground leading-none mt-0.5">
                        {day}
                      </span>
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-foreground group-hover:text-amber-400 transition-colors truncate">
                          {e.title}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20 shrink-0">
                          {e.tag}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {e.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}