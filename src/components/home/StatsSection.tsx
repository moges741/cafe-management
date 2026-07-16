const STATS = [
  { value: '15K+', label: 'Happy customers' },
  { value: '4.9', label: 'Average rating' },
  { value: '50+', label: 'Menu items' },
  { value: '3', label: 'Branches' },
]

export default function StatsSection() {
  return (
    <section className="py-14 px-6 border-y border-border bg-card">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: '#B58B67' }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}