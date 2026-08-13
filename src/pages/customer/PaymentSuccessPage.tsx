import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, FileText, Clock, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGetOrderByIdQuery } from '@/features/orders/ordersApi'
import { useVerifyChapaPaymentMutation } from '@/features/payments/paymentsApi'

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  const { data: order, isLoading: isOrderLoading, refetch } = useGetOrderByIdQuery(orderId!, {
    skip: !orderId,
  })

  const [verifyPayment, { isLoading: isVerifying }] = useVerifyChapaPaymentMutation()

  useEffect(() => {
    if (orderId) {
      verifyPayment(orderId)
        .unwrap()
        .then(() => {
          refetch()
        })
        .catch((err) => {
          console.error('Chapa verification failed:', err)
        })
    }
  }, [orderId, verifyPayment, refetch])

  const isLoading = isOrderLoading || isVerifying

  return (
    <div className="min-h-screen bg-[#050301] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-amber-500/30">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-900/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Success Card */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
          
          {/* Subtle inside glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />

          {/* Animated Checkmark */}
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1 
            }}
            className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative"
          >
            <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping opacity-20" />
            <CheckCircle2 size={48} className="text-emerald-500" strokeWidth={1.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-black text-white tracking-tight mb-3">
              Payment Successful
            </h1>
            <p className="text-neutral-400 font-medium mb-8">
              Your order has been received and is being prepared with care.
            </p>
          </motion.div>

          {/* Order Details Box */}
          {isLoading ? (
             <div className="w-full py-8 flex justify-center">
               <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
             </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 mb-8 text-left space-y-4"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-3 text-neutral-300">
                  <FileText size={16} className="text-amber-500" />
                  <span className="text-sm font-medium">Order Number</span>
                </div>
                <span className="font-bold text-white">{order?.orderNumber || "Pending"}</span>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-3 text-neutral-300">
                  <Clock size={16} className="text-amber-500" />
                  <span className="text-sm font-medium">Est. Prep Time</span>
                </div>
                <span className="font-bold text-white">10-15 mins</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-neutral-300">
                  <Coffee size={16} className="text-amber-500" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  {order?.status === 'pending' ? 'Order Received' : order?.status || 'Processing'}
                </span>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full space-y-3"
          >
            {orderId ? (
              <Link to={`/order/${orderId}/track`} className="block w-full">
                <Button 
                  className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-black text-base font-bold rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 group"
                >
                  Track Order Live
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Button disabled className="w-full h-14 bg-amber-500/50 text-black text-base font-bold rounded-xl">
                Track Order Live
              </Button>
            )}
            <Link to="/menu" className="block w-full">
              <Button 
                variant="outline" 
                className="w-full h-14 bg-white/5 hover:bg-white/10 border-white/10 text-white text-base font-medium rounded-xl transition-all"
              >
                Back to Menu
              </Button>
            </Link>
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}