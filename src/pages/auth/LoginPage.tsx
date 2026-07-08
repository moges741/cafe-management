import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-background border-r border-border p-10 flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Mr. Cafe
          </h1>
        </div>

        {/* Decorative coffee-bean pattern using CSS, no image dependency yet */}
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
          <p className="text-secondary mt-2 text-sm" style={{ color: '#B58B67' }}>
            Order ahead, skip the line, taste the difference.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
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

          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>

            <Button type="submit" className="w-full">
              Log in
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