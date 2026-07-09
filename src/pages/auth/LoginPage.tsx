import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginMutation } from '@/features/auth/authApi'
import { loginSchema, type LoginFormData } from './schemas'

export default function LoginPage() {
  const navigate = useNavigate()

  // useLoginMutation returns a tuple:
  // [triggerFunction, { data, error, isLoading, ...}]
  // Calling login(formData) fires the actual POST /auth/login request
  const [login, { isLoading }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // This runs only after Zod validation passes
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap()
      // .unwrap() converts RTK Query's result object into a normal
      // promise that throws on failure — lets us use try/catch naturally

      toast.success('Logged in')

      // Backend doesn't tell us the role directly from /login yet
      // (cookies are HttpOnly, we can't decode the JWT client-side)
      // so for now redirect to a neutral landing page —
      // once GET /auth/me exists, we redirect based on role instead
      navigate('/')
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 relative bg-background border-r border-border p-10 flex-col justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Mr. Cafe</h1>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full border border-primary/30 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border border-primary/50 flex items-center justify-center">
              <span className="text-primary text-5xl font-bold">MC</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-foreground leading-snug">
            Brewed with care,
            <br />
            served with soul.
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#B58B67' }}>
            Order ahead, skip the line, taste the difference.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm mt-1" style={{ color: '#B58B67' }}>
              New here?{' '}
              <Link to="/register" className="text-primary underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          <p className="text-xs text-center" style={{ color: '#B58B67' }}>
            By continuing you agree to Mr. Cafe's terms of service.
          </p>
        </div>
      </div>
    </div>
  )
}