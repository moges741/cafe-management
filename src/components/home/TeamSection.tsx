const TEAM = [
  { name: 'Moges', role: 'Founder & Head Roaster' },
  { name: 'Selamawit', role: 'Head Chef' },
  { name: 'Yonas', role: 'Operations Lead' },
]

export default function TeamSection() {
  return (
    <section className="py-20 px-6 relative overflow-hidden bg-background border-y border-border">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] rounded-full bg-amber-950/15 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
          Meet the team
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:border-amber-500/25 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300 group text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary font-bold border border-primary/20 group-hover:scale-105 group-hover:border-amber-500/50 transition-all duration-300">
                {member.name[0]}
              </div>
              <p className="text-sm font-medium text-foreground">{member.name}</p>
              <p className="text-xs mt-0.5 text-neutral-300">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}