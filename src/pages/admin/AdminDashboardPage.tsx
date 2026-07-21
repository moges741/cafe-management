"use client";

import { Link } from 'react-router-dom'
import { ArrowRight, Package, ReceiptText, Tags, TriangleAlert, Sparkles, TrendingUp, Users, Activity } from 'lucide-react'
import { useGetDashboardQuery } from '@/features/analytics/analyticsApi'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SkeletonMetricCard } from '@/components/ui/Skeleton'

// Animation variants for staggered entrance
const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function AdminDashboardPage() {
  const { branchId } = useCurrentBranch()
  const { data, isLoading } = useGetDashboardQuery({ period: 'this_week', branchId: branchId || undefined }, { skip: !branchId })

  return (
    <div className="min-h-screen bg-[#050301] relative overflow-hidden pb-20">
      
      {/* --- Ambient Background Glows --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-orange-950/20 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-8 relative z-10 pt-10">
        
        {/* ================= HERO SECTION ================= */}
        <motion.section 
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-[32px] border border-white/10 bg-white/[0.02] backdrop-blur-3xl p-8 md:p-12 overflow-hidden relative shadow-2xl shadow-amber-500/5"
        >
          {/* Subtle inner grid/texture overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />
          
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between z-10">
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <Sparkles size={14} className="animate-pulse" /> Admin Command Center
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Welcome back to <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
                  Mr. Cafe
                </span>
              </h1>
              <p className="text-base md:text-lg text-neutral-400 max-w-xl font-medium leading-relaxed">
                Track your weekly sales, monitor live orders, manage stock pressure, and organize categories from one beautiful interface.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
              <QuickLink to="/admin/orders" label="Live Orders" icon={Activity} />
              <QuickLink to="/admin/inventory" label="Inventory" icon={Package} />
              <QuickLink to="/admin/categories" label="Categories" icon={Tags} />
            </div>
          </div>
        </motion.section>

        {/* ================= DASHBOARD CONTENT ================= */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonMetricCard key={i} />
            ))}
          </div>
        ) : data ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Key Metrics */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                label="Weekly Revenue" 
                value={`${data.salesSummary.totalRevenue.toLocaleString()} ETB`} 
                icon={TrendingUp}
                trend="+12%"
              />
              <MetricCard 
                label="Total Orders" 
                value={data.salesSummary.totalOrders.toString()} 
                icon={ReceiptText}
              />
              <MetricCard 
                label="Avg Order Value" 
                value={`${Number(data.salesSummary.averageOrder).toFixed(0)} ETB`} 
                icon={Users}
              />
              <MetricCard 
                label="Low Stock Items" 
                value={data.lowStockAlerts.length.toString()} 
                icon={Package}
                tone={data.lowStockAlerts.length ? 'warn' : 'default'}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              {/* Orders Status Grid */}
              <motion.div variants={itemVariants} className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 shadow-xl flex flex-col group">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Order Status</h2>
                    <p className="text-sm text-neutral-400 mt-1">Snapshot of all orders this week</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:scale-110 transition-transform duration-500">
                    <ReceiptText size={22} />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
                  {Object.entries(data.salesSummary.ordersByStatus).map(([status, count]) => (
                    <div key={status} className="rounded-2xl border border-white/5 bg-white/5 p-5 flex flex-col justify-between hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300">
                      <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-neutral-400">
                        {status.replace('_', ' ')}
                      </p>
                      <p className="mt-4 text-4xl font-black text-white">{count}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Low Stock Alerts */}
              <motion.div variants={itemVariants} className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 shadow-xl flex flex-col group">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Stock Alerts</h2>
                    <p className="text-sm text-neutral-400 mt-1">Items needing attention</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)] group-hover:scale-110 transition-transform duration-500">
                    <TriangleAlert size={22} />
                  </div>
                </div>
                
                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1" style={{ maxHeight: '230px' }}>
                  {data.lowStockAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500">
                      <Package size={40} className="opacity-20 mb-3" />
                      <p className="text-sm font-medium">All stock levels are optimal.</p>
                    </div>
                  ) : data.lowStockAlerts.map((alert) => (
                    <div key={alert.productName} className="group/alert flex items-center justify-between rounded-2xl border border-red-500/10 bg-red-500/5 px-5 py-4 hover:border-red-500/30 hover:bg-red-500/10 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-white">{alert.productName}</p>
                        <p className="text-xs font-medium text-red-400 mt-1">Threshold: {alert.threshold}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-red-400 leading-none block">
                          {alert.quantity}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-red-500/70 tracking-wider">
                          Left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              {/* Top Products */}
              <motion.div variants={itemVariants} className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 shadow-xl group">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Top Products</h2>
                    <p className="text-sm text-neutral-400 mt-1">Best sellers by revenue</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:scale-110 transition-transform duration-500">
                    <Sparkles size={22} />
                  </div>
                </div>
                <div className="space-y-3">
                  {data.topProducts.slice(0, 5).map((item, idx) => (
                    <div key={item.productId} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 hover:border-amber-500/30 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-amber-400 font-bold text-sm shadow-inner">
                          #{idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white mb-0.5">{item.name}</p>
                          <p className="text-xs font-medium text-neutral-400">{item.unitsSold} units sold</p>
                        </div>
                      </div>
                      <span className="text-sm text-amber-400 font-extrabold tracking-wide">
                        {item.revenue.toLocaleString()} ETB
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants} className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Quick Actions</h2>
                    <p className="text-sm text-neutral-400 mt-1">Manage operations instantly</p>
                  </div>
                </div>
                <div className="grid gap-4">
                  <DashboardAction to="/admin/products/new" title="Create Product" description="Add new menu items with photos and prices" />
                  <DashboardAction to="/admin/categories" title="Manage Categories" description="Organize your menu structure" />
                  <DashboardAction to="/admin/inventory" title="Update Inventory" description="Restock items and fix low stock alerts" />
                </div>
              </motion.div>
            </section>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}

// ================= SUB-COMPONENTS =================

function MetricCard({ label, value, icon: Icon, tone = 'default', trend }: { label: string; value: string; icon: any; tone?: 'default' | 'warn'; trend?: string }) {
  const isWarn = tone === 'warn'
  
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-xl relative overflow-hidden group"
    >
      {/* Background Hover Glow */}
      <div className={cn(
        "absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-30",
        isWarn ? "bg-red-500" : "bg-amber-500"
      )} />
      
      <div className="relative flex justify-between items-start mb-6 z-10">
        <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-neutral-400">{label}</p>
        <div className={cn(
          "p-2.5 rounded-xl border shadow-inner transition-transform duration-500 group-hover:scale-110", 
          isWarn 
            ? "bg-red-500/10 border-red-500/20 text-red-400" 
            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
        )}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="relative flex items-end gap-3 z-10">
        <p className={cn("text-3xl lg:text-4xl font-extrabold tracking-tight", isWarn ? "text-red-400" : "text-white")}>
          {value}
        </p>
        {trend && (
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full mb-1">
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  )
}

function QuickLink({ to, label, icon: Icon }: { to: string; label: string; icon: any }) {
  return (
    <Link to={to} className="block w-full sm:w-auto">
      <motion.div 
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-sm font-bold text-white hover:border-amber-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all group"
      >
        <Icon size={18} className="text-amber-400" />
        {label}
        <ArrowRight size={16} className="text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
      </motion.div>
    </Link>
  )
}

function DashboardAction({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <Link to={to} className="block">
      <motion.div 
        whileHover={{ x: 5 }}
        className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-amber-500/40 hover:bg-white/10 transition-all shadow-sm"
      >
        <div>
          <p className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">{title}</p>
          <p className="text-xs font-medium mt-1.5 text-neutral-400 group-hover:text-neutral-300">{description}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-black/30 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:border-amber-500/50 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-all">
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </Link>
  )
}