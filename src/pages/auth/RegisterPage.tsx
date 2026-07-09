import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegisterMutation } from '@/features/auth/authApi'
import { registerSchema, type RegisterFormData } from './schemas'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [registerUser, { isLoading }] = useRegisterMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data).unwrap()
      toast.success('Account created — please log in')
      navigate('/login')
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Registration failed')
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
            Your table is waiting.
          </h2>
          <p className="text-sm mt-2" style={{ color: '#B58B67' }}>
            Join Mr. Cafe and order in seconds next time.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Create an account</h2>
            <p className="text-sm mt-1" style={{ color: '#B58B67' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-primary underline underline-offset-4">
                Log in
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
                placeholder="At least 8 characters"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}