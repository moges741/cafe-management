const TEAM = [
  { name: 'Moges', role: 'Founder & Head Roaster' },
  { name: 'Selamawit', role: 'Head Chef' },
  { name: 'Yonas', role: 'Operations Lead' },
]

export default function TeamSection() {
  return (
    <section className="py-20 px-6 bg-card border-y border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-center mb-10">Meet the team</h2>
        <div className="grid grid-cols-3 gap-5">
          {TEAM.map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-3 text-primary font-bold">
                {member.name[0]}
              </div>
              <p className="text-sm font-medium text-foreground">{member.name}</p>
              <p className="text-xs mt-0.5" style={{ color: '#B58B67' }}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}