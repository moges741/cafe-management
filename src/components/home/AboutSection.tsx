export default function AboutSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Our story</p>
        <h2 className="text-3xl font-bold text-foreground mb-5">
          Where every cup tells a story
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#B58B67' }}>
          Mr. Cafe started with a simple idea — good coffee shouldn't be complicated,
          and good food shouldn't take forever. From our roastery to your table, every
          bean, every plate, and every order is handled with the same care you'd expect
          from a neighborhood spot that actually knows your name. Today, we blend that
          same warmth with modern technology — real-time order tracking, AI-assisted
          ordering, and a kitchen that never keeps you guessing.
        </p>
      </div>
    </section>
  )
}