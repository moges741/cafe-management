import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginMutation } from '@/features/auth/authApi'
import { loginSchema, type LoginFormData } from './schemas'
import { authApi } from '@/features/auth/authApi'
import { useAppDispatch } from '@/app/hooks'
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
 const dispatch = useAppDispatch()

const onSubmit = async (data: LoginFormData) => {
  try {
    await login(data).unwrap()

    // Force RTK Query to refetch /auth/me now that we have a fresh cookie
    // This populates Redux with the real user + role immediately
    const result = await dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }))

    if ('data' in result && result.data) {
      const role = result.data.role.name

      toast.success('Logged in')

      // Now we can route based on actual role
      if (role === 'admin' || role === 'manager') navigate('/admin')
      else if (role === 'kitchen') navigate('/kitchen')
      else if (role === 'cashier') navigate('/cashier')
      else navigate('/menu')
    }
  } catch (err: any) {
    toast.error(err?.data?.message || err?.data?.error?.message || 'Login failed')
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
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