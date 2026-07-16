import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForgotPasswordMutation } from '@/features/auth/authApi'
import { CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')

    try {
      await forgotPassword({ email }).unwrap()
      setIsSubmitted(true)
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.error?.message || 'Failed to send reset link')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6 bg-card border border-border p-8 rounded-xl shadow-sm">
        
        {!isSubmitted ? (
          <>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
              <p className="text-sm mt-1 text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending link...' : 'Send reset link'}
              </Button>
            </form>

            <div className="text-center text-sm">
              <Link to="/login" className="text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="text-green-500" size={48} />
            </div>
            <h2 className="text-xl font-bold text-foreground">Check your email</h2>
            <p className="text-muted-foreground text-sm">
              If an account exists with <strong>{email}</strong>, we have sent a password reset link.
            </p>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link to="/login">Return to Login</Link>
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}
