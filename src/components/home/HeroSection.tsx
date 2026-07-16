import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

// Place these files in /public exactly as named
const HERO_IMAGES = ['/image1.png', '/image2.png', '/image3.png', '/image4.png', '/image5.png']

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % HERO_IMAGES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[92vh] w-full overflow-hidden bg-background">
      {/* Slides */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Mr. Cafe</p>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground max-w-2xl leading-tight">
          Good food, honest coffee, made with soul.
        </h1>
        <p className="mt-4 text-sm md:text-base max-w-md" style={{ color: '#B58B67' }}>
          Order online, dine in, or let our AI assistant take care of it for you.
        </p>
        <div className="flex gap-3 mt-8">
          <Link to="/menu">
            <Button size="lg">View menu</Button>
          </Link>
          <Link to="/menu">
            <Button size="lg" variant="outline">Order now</Button>
          </Link>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 8,
              background: i === current ? '#B58B67' : 'rgba(181,139,103,0.35)',
            }}
          />
        ))}
      </div>
    </section>
  )
}