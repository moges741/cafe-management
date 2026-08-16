import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResetPasswordMutation } from '@/features/auth/authApi'
import { XCircle, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md bg-card border border-border p-8 rounded-xl text-center space-y-4">
          <div className="flex justify-center">
            <XCircle className="text-destructive" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Invalid Link</h2>
          <p className="text-muted-foreground">No reset token provided. Please request a new password reset link.</p>
          <Link to="/forgot-password" className="inline-flex w-full mt-4 items-center justify-center rounded-lg border border-border bg-background px-4 h-8 text-sm font-medium transition-colors hover:bg-muted">Request Reset Link</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      return toast.error('Password must be at least 8 characters')
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match')
    }

    if (!navigator.onLine) {
      toast.error('Network offline: Internet connection is required to reset password.', {
        icon: '📡',
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
      })
      return
    }

    try {
      await resetPassword({ token, password }).unwrap()
      toast.success('Password successfully reset! Please log in.')
      navigate('/login')
    } catch (err: any) {
      if (err?.status === 'FETCH_ERROR' || !navigator.onLine) {
        toast.error('Network offline: Internet connection is required to reset password.', {
          icon: '📡',
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
        })
      } else {
        toast.error(err?.data?.message || err?.data?.error?.message || 'Failed to reset password')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6 bg-card border border-border p-8 rounded-xl shadow-sm">
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-foreground">New Password</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

      </div>
    </div>
  )
}
