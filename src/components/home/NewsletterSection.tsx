import { useState } from 'react'
import { Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    if (!email.includes('@')) {
      toast.error('Enter a valid email')
      return
    }
    toast.success('Subscribed — welcome to Mr. Cafe')
    setEmail('')
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Stay in the loop</h2>
        <p className="text-sm mb-6" style={{ color: '#B58B67' }}>New menu drops, events, and offers.</p>
        <div className="flex gap-2">
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          <Button onClick={handleSubmit}><Send size={14} /></Button>
        </div>
      </div>
    </section>
  )
}