import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

export default function ReservationSection() {
  const [name, setName] = useState('')
  const [guests, setGuests] = useState('2')
  const [date, setDate] = useState('')

  // No backend reservation endpoint exists yet — this captures intent only,
  // shows a confirmation toast. Wire to a real endpoint once one exists.
  const handleSubmit = () => {
    if (!name || !date) {
      toast.error('Fill in your name and preferred date')
      return
    }
    toast.success('Reservation request sent — we\'ll confirm shortly')
    setName(''); setDate('')
  }

  return (
    <section className="py-20 px-6 relative overflow-hidden bg-background border-y border-border">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-amber-950/15 blur-[150px] pointer-events-none" />

      <div className="max-w-md mx-auto text-center bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:border-amber-500/25 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300 relative z-10">
        <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
          Reserve a table
        </h2>
        <p className="text-sm mb-8 text-neutral-300">We'll hold your favorite spot.</p>

        <div className="space-y-3 text-left">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="bg-background/50 border-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Guests</Label>
              <Input type="number" value={guests} onChange={e => setGuests(e.target.value)} className="bg-background/50 border-white/10" />
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-background/50 border-white/10" />
            </div>
          </div>
          <Button className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:opacity-90 font-semibold shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all" onClick={handleSubmit}>
            Request reservation
          </Button>
        </div>
      </div>
    </section>
  )
}