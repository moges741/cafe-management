import { Coffee, Salad, Truck, Wifi, Armchair, CreditCard } from 'lucide-react'

const FEATURES = [
  { icon: Coffee,     title: 'Premium coffee beans', desc: 'Ethically sourced, freshly roasted weekly' },
  { icon: Salad,      title: 'Fresh ingredients',     desc: 'Locally sourced produce, no shortcuts' },
  { icon: Truck,      title: 'Fast delivery',         desc: 'Hot food, fast — every single time' },
  { icon: Wifi,       title: 'Free WiFi',              desc: 'Work, study, or just relax' },
  { icon: Armchair,   title: 'Comfortable workspace',  desc: 'Designed for long, easy afternoons' },
  { icon: CreditCard, title: 'Cashless payment',       desc: 'Chapa, card, or cash — your choice' },
]

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 px-6 bg-card border-y border-border">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why choose us</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-background border border-border rounded-2xl p-5">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center mb-3">
                <f.icon size={18} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">{f.title}</p>
              <p className="text-xs mt-1" style={{ color: '#B58B67' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}