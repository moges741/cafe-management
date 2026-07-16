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
    <section className="py-20 px-6 bg-card border-y border-border">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Reserve a table</h2>
        <p className="text-sm mb-8" style={{ color: '#B58B67' }}>We'll hold your favorite spot.</p>

        <div className="space-y-3 text-left">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Guests</Label>
              <Input type="number" value={guests} onChange={e => setGuests(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <Button className="w-full mt-2" onClick={handleSubmit}>Request reservation</Button>
        </div>
      </div>
    </section>
  )
}