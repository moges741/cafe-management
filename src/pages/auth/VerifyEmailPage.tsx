import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useVerifyEmailMutation } from '@/features/auth/authApi'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [verifyEmail] = useVerifyEmailMutation()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided.')
      return
    }

    verifyEmail({ token })
      .unwrap()
      .then((res) => {
        setStatus('success')
        setMessage(res.message)
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err?.data?.message || err?.data?.error?.message || 'Verification failed')
      })
  }, [token, verifyEmail])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-xl text-center space-y-6">
        
        {status === 'loading' && (
          <>
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Verifying Email</h2>
            <p className="text-muted-foreground">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center">
              <CheckCircle className="text-green-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Email Verified!</h2>
            <p className="text-muted-foreground">{message}</p>
            <Button asChild className="w-full mt-4">
              <Link to="/login">Go to Login</Link>
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center">
              <XCircle className="text-destructive" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Verification Failed</h2>
            <p className="text-muted-foreground">{message}</p>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link to="/login">Back to Login</Link>
            </Button>
          </>
        )}

      </div>
    </div>
  )
}
