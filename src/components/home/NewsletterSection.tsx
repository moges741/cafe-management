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
    <section className="py-16 px-6 relative overflow-hidden bg-background">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-amber-950/15 blur-[120px] pointer-events-none" />

      <div className="max-w-md mx-auto text-center bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:border-amber-500/25 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300 relative z-10">
        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
          Stay in the loop
        </h2>
        <p className="text-sm mb-6 text-neutral-300">New menu drops, events, and offers.</p>
        <div className="flex gap-2">
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="bg-background/50 border-white/10" />
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:opacity-90 font-semibold shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all">
            <Send size={14} />
          </Button>
        </div>
      </div>
    </section>
  )
}