import { Coffee, Beef, UtensilsCrossed, Flame } from 'lucide-react'

const FAVORITES = [
  { icon: Coffee,           name: 'Cappuccino' },
  { icon: Beef,              name: 'Cheeseburger' },
  { icon: Flame,             name: 'Ethiopian Macchiato' },
  { icon: UtensilsCrossed,  name: 'Pasta Alfredo' },
]

export default function CustomerFavoritesSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-center mb-10">Customer favorites</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {FAVORITES.map((item) => (
            <div key={item.name} className="bg-card border border-border rounded-2xl p-6 text-center">
              <item.icon size={26} className="text-primary mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}