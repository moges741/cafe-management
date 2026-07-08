import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
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

          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="At least 8 characters" />
            </div>

            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}