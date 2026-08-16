import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForgotPasswordMutation } from '@/features/auth/authApi'
import { CheckCircle, Mail, Coffee } from 'lucide-react'
import { motion } from 'framer-motion'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')

    if (!navigator.onLine) {
      toast.error('Network offline: Internet connection is required to reset password.', {
        icon: '📡',
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
      })
      return
    }

    try {
      await forgotPassword({ email }).unwrap()
      setIsSubmitted(true)
    } catch (err: any) {
      if (err?.status === 'FETCH_ERROR' || !navigator.onLine) {
        toast.error('Network offline: Internet connection is required to reset password.', {
          icon: '📡',
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
        })
      } else {
        toast.error(err?.data?.message || err?.data?.error?.message || 'Failed to send reset link')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050301] p-6 relative overflow-hidden selection:bg-amber-500/30">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-orange-950/15 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Coffee size={24} />
            </div>
          </Link>
        </div>

        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl">
          {!isSubmitted ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Reset Password</h2>
                <p className="text-sm mt-2 text-neutral-400">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-11 h-12 bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-amber-500/50 rounded-xl transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />
                      Sending link…
                    </span>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>

              <div className="text-center text-sm mt-6">
                <Link to="/login" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
                  ← Back to Login
                </Link>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle className="text-emerald-400" size={32} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white">Check your email</h2>
              <p className="text-neutral-400 text-sm">
                If an account exists for <span className="text-amber-400 font-semibold">{email}</span>, a reset link has been sent.
              </p>
              <Link to="/login" className="inline-flex w-full mt-4 items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold h-10 px-4 text-sm transition-colors">Return to Login</Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
