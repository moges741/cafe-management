import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Mail, Lock, Coffee, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginMutation } from '@/features/auth/authApi'
import { loginSchema, type LoginFormData } from './schemas'
import { authApi } from '@/features/auth/authApi'
import { useSyncCartMutation } from '@/features/cart/cartApi'
import { useAppDispatch } from '@/app/hooks'
import { cn } from '@/lib/utils'
import Spinner from '@/components/ui/Spinner'

// Framer Motion Variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
} as const

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
} as const

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const location = useLocation()

  const [login, { isLoading }] = useLoginMutation()
  const [syncCart] = useSyncCartMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap()

      // Sync guest cart to user account
      const localCartStr = localStorage.getItem('mr_cafe_cart')
      if (localCartStr) {
        try {
          const localCart = JSON.parse(localCartStr)
          if (localCart.items?.length > 0) {
            await syncCart(localCart.items).unwrap()
          }
        } catch(e) {}
      }

      const result = await dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }))

      if ('data' in result && result.data) {
        const role = result.data.role

        toast.success('Logged in successfully', {
          icon: '☕',
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(245, 158, 11, 0.2)' }
        })

        const from = location.state?.from?.pathname || null
        if (from) {
          navigate(from, { replace: true })
        } else {
          if (role === 'admin' || role === 'manager') navigate('/admin')
          else if (role === 'kitchen') navigate('/kitchen')
          else if (role === 'cashier') navigate('/cashier') 
          else if (role === 'waiter') navigate('/waiter')
          else navigate('/')
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.error?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex bg-[#050301] overflow-hidden selection:bg-amber-500/30">
      
      {/* ================= LEFT COLUMN (BRAND/IMAGE) ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        
        {/* Background Image Setup */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop")', 
            backgroundColor: '#110a05' // Fallback color if no image
          }}
        />
        
        {/* Gradients to blend image smoothly into the dark theme */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#050301]/80 via-[#050301]/50 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#050301] via-transparent to-transparent" />
        <div className="absolute inset-0 z-0 bg-black/20 backdrop-blur-[2px]" />

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex items-center gap-3"
        >
          <Link to="/">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Coffee size={20} />
          </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Mr. Cafe</h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 max-w-lg"
        >
          <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Brewed with care,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              served with soul.
            </span>
          </h2>
          <p className="text-lg text-neutral-300 font-medium">
            Order ahead, skip the line, and taste the difference. 
            Access your personalized dashboard to manage your cafe experience.
          </p>
          
          {/* Glassmorphic decorative element */}
          <div className="mt-12 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md inline-flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050301] bg-neutral-800 flex items-center justify-center text-xs text-neutral-400">
                  User
                </div>
              ))}
            </div>
            <div className="text-sm font-medium text-neutral-300">
              Join <span className="text-amber-400">2,000+</span> daily coffee lovers.
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================= RIGHT COLUMN (FORM) ================= */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        
        {/* Ambient Mobile Background Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none lg:hidden" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-orange-950/15 rounded-full blur-[150px] mix-blend-screen pointer-events-none lg:hidden" />

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <motion.div variants={fadeUpVariants} className="lg:hidden flex justify-center mb-8">
            <Link to="/">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Coffee size={28} />
            </div>
            </Link>
          </motion.div>

          <motion.div variants={fadeUpVariants} className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome back</h2>
            <p className="text-sm mt-2 text-neutral-400 font-medium">
              New here?{' '}
              <Link to="/register" className="text-amber-500 hover:text-amber-400 font-semibold underline underline-offset-4 transition-colors">
                Create an account
              </Link>
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div variants={fadeUpVariants} className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[32px] pointer-events-none" />
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10" noValidate>
              
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    className={cn(
                      "pl-11 h-12 bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-amber-500/50 rounded-xl transition-all",
                      errors.email && "border-red-500/50 focus-visible:ring-red-500/50"
                    )}
                  />
                </div>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-red-400 font-medium pl-1">
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={cn(
                      "pl-11 h-12 bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-amber-500/50 rounded-xl transition-all",
                      errors.password && "border-red-500/50 focus-visible:ring-red-500/50"
                    )}
                  />
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-red-400 font-medium pl-1">
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 mt-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all group" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Spinner size="sm" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
Login 
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.p variants={fadeUpVariants} className="text-xs text-center text-neutral-500 mt-8 font-medium">
            By continuing you agree to Mr. Cafe's <Link to="#" className="text-neutral-400 hover:text-white underline underline-offset-2">Terms of Service</Link> and <Link to="#" className="text-neutral-400 hover:text-white underline underline-offset-2">Privacy Policy</Link>.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}