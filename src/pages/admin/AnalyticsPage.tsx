"use client";

import { useState } from 'react'
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, PieChart, Pie, Cell 
} from 'recharts'
import { TrendingUp, ShoppingBag, DollarSign, AlertTriangle, Package, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetDashboardQuery } from '@/features/analytics/analyticsApi'
import { cn } from '@/lib/utils'

const PERIODS = [
  { key: 'today',      label: 'Today' },
  { key: 'this_week',  label: 'This week' },
  { key: 'this_month', label: 'This month' },
]

// Premium warm and functional color palette
const STATUS_COLORS: Record<string, string> = {
  pending:    '#737373', // neutral-500
  confirmed:  '#FBBF24', // amber-400
  in_kitchen: '#F97316', // orange-500
  ready:      '#34D399', // emerald-400
  completed:  '#10B981', // emerald-500
  cancelled:  '#EF4444', // red-500
}

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

// Custom Recharts Tooltip for Glassmorphism
const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#120804]/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl">
        <p className="text-amber-400 text-xs font-bold mb-2 uppercase tracking-wider">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-neutral-300">
              {formatter ? formatter(entry.value, entry.name)[1] : entry.name}:
            </span>
            <span className="text-white font-bold">{formatter ? formatter(entry.value, entry.name)[0] : entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

import { useCurrentBranch } from '@/hooks/useCurrentBranch'

export default function AnalyticsPage() {
  const { branchId } = useCurrentBranch()
  const [period, setPeriod] = useState('this_week')
  const { data, isLoading } = useGetDashboardQuery({ period, branchId: branchId || undefined }, { skip: !branchId })

  const statusData = data
    ? Object.entries(data.salesSummary.ordersByStatus).map(([status, count]) => ({
        name: status.replace('_', ' '),
        value: count,
        color: STATUS_COLORS[status] ?? '#888780',
      }))
    : []

  return (
    <div className="min-h-screen bg-[#050301] relative overflow-hidden pb-20">
      
      {/* --- Ambient Background Glows --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-amber-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-0 w-[30vw] h-[30vw] bg-orange-950/15 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="p-6 max-w-7xl mx-auto relative z-10 pt-10">
        
        {/* ================= HEADER ================= */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              <BarChart3 size={12} /> Insights
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Analytics Overview
            </h1>
          </div>

          {/* Premium Animated Segmented Control */}
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-full p-1.5 backdrop-blur-md">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={cn(
                  'relative px-5 py-2 rounded-full text-xs font-semibold transition-colors duration-300',
                  period === p.key ? 'text-black' : 'text-neutral-400 hover:text-white'
                )}
              >
                {period === p.key && (
                  <motion.div
                    layoutId="active-period"
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{p.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ================= SKELETONS ================= */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 rounded-[24px] bg-white/5 border border-white/10 animate-pulse backdrop-blur-md" />
            ))}
          </div>
        )}

        {/* ================= DASHBOARD CONTENT ================= */}
        <AnimatePresence mode="wait">
          {data && (
            <motion.div 
              key={period} // Re-animate when period changes
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            >
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard icon={DollarSign} label="Revenue" value={`${data.salesSummary.totalRevenue.toLocaleString()} ETB`} />
                <MetricCard icon={ShoppingBag} label="Total Orders" value={data.salesSummary.totalOrders.toLocaleString()} />
                <MetricCard icon={TrendingUp} label="Avg Order Value" value={`${Number(data.salesSummary.averageOrder).toFixed(0)} ETB`} />
              </div>

              {/* Main Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Order Volume Area Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-xl">
                  <p className="text-lg font-bold text-white mb-6 tracking-tight">Order Volume Activity</p>
                  {data.orderVolume.byDay.length === 0 ? (
                    <div className="flex items-center justify-center h-[250px] text-neutral-500 text-sm font-medium">No orders in this period yet.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={data.orderVolume.byDay}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="date" stroke="#737373" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#737373" fontSize={11} tickLine={false} axisLine={false} dx={-10} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#F59E0B" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#colorCount)" 
                          activeDot={{ r: 6, fill: '#FBBF24', stroke: '#000', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </motion.div>

                {/* Status Breakdown Pie */}
                <motion.div variants={itemVariants} className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-xl flex flex-col">
                  <p className="text-lg font-bold text-white mb-6 tracking-tight">Orders by Status</p>
                  {statusData.every(s => s.value === 0) ? (
                    <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm font-medium">No data yet.</div>
                  ) : (
                    <>
                      <div className="relative h-[200px] w-full flex items-center justify-center">
                        {/* Glow effect behind pie */}
                        <div className="absolute inset-0 bg-amber-500/5 blur-2xl rounded-full" />
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie 
                              data={statusData} 
                              dataKey="value" 
                              innerRadius={60} 
                              outerRadius={85} 
                              paddingAngle={5}
                              stroke="none"
                            >
                              {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-black text-white">{data.salesSummary.totalOrders}</span>
                          <span className="text-[10px] uppercase tracking-widest text-neutral-400">Total</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mt-6">
                        {statusData.filter(s => s.value > 0).map((s, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                            <span className="flex items-center gap-3 capitalize text-sm font-medium text-neutral-300">
                              <span className="w-3 h-3 rounded-full shadow-inner border border-white/20" style={{ background: s.color }} />
                              {s.name}
                            </span>
                            <span className="text-white font-bold">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Top Products */}
                <motion.div variants={itemVariants} className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-xl">
                  <p className="text-lg font-bold text-white mb-6 tracking-tight">Top Products</p>
                  {data.topProducts.length === 0 ? (
                    <p className="text-neutral-500 text-sm font-medium">No sales data yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={data.topProducts} layout="vertical" margin={{ left: 0, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis type="number" stroke="#737373" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
                        <YAxis dataKey="name" type="category" stroke="#D4D4D8" fontSize={12} width={100} tickLine={false} axisLine={false} fontWeight={500} />
                        <Tooltip 
                          content={<CustomTooltip formatter={(value: any, name: string) => [value, name === 'unitsSold' ? 'Units sold' : name]} />} 
                        />
                        <Bar 
                          dataKey="unitsSold" 
                          fill="#F59E0B" 
                          radius={[0, 8, 8, 0]}
                          barSize={24}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </motion.div>

                {/* Inventory & Alerts */}
                <motion.div variants={itemVariants} className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-xl flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Package size={18} />
                    </div>
                    <p className="text-lg font-bold text-white tracking-tight">Inventory Monitor</p>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {data.inventoryConsumption.map((item) => (
                      <div key={item.inventoryId} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-sm font-medium text-white">{item.productName}</span>
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                          {item.currentStock} {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Low Stock Alerts Module */}
                  {data.lowStockAlerts.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle size={16} className="text-red-500 animate-pulse" />
                        <span className="text-sm font-bold text-red-500 tracking-wide uppercase">Critical Stock Alerts</span>
                      </div>
                      <div className="space-y-2">
                        {data.lowStockAlerts.map((alert, i) => (
                          <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                            <span className="text-sm font-bold text-white">{alert.productName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-black text-red-500 leading-none">{alert.quantity}</span>
                              <span className="text-[10px] uppercase font-bold text-red-500/70 tracking-wider">Left</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ================= SUB-COMPONENTS =================

function MetricCard({ icon: Icon, label, value }: { icon: typeof DollarSign; label: string; value: string }) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[24px] p-6 shadow-xl relative overflow-hidden group"
    >
      {/* Background Hover Glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform duration-500">
          <Icon size={20} className="text-amber-400" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-neutral-400 mb-1">{label}</p>
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      </div>
    </motion.div>
  )
}