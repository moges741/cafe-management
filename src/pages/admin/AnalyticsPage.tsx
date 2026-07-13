import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, ShoppingBag, DollarSign, AlertTriangle } from 'lucide-react'
import { useGetDashboardQuery } from '@/features/analytics/analyticsApi'
import { cn } from '@/lib/utils'

const PERIODS = [
  { key: 'today',      label: 'Today' },
  { key: 'this_week',  label: 'This week' },
  { key: 'this_month', label: 'This month' },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('this_week')
  const { data, isLoading } = useGetDashboardQuery({ period })

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <div className="flex gap-1 bg-secondary rounded-full p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors',
                period === p.key ? 'bg-primary text-primary-foreground' : 'text-foreground'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-xl bg-card animate-pulse" />)}
        </div>
      )}

      {data && (
        <>
          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <MetricCard
              icon={DollarSign}
              label="Revenue"
              value={`${data.sales.totalRevenue.toLocaleString()} ETB`}
            />
            <MetricCard
              icon={ShoppingBag}
              label="Orders"
              value={data.sales.totalOrders.toLocaleString()}
            />
            <MetricCard
              icon={TrendingUp}
              label="Avg order value"
              value={`${data.sales.avgOrderValue.toFixed(0)} ETB`}
            />
          </div>

          {/* Order volume line chart */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-6">
            <p className="text-sm font-medium text-foreground mb-4">Order volume</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.orderVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(172 25% 22%)" />
                <XAxis dataKey="date" stroke="#B58B67" fontSize={12} />
                <YAxis stroke="#B58B67" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#17332F', border: '1px solid hsl(172 25% 22%)', borderRadius: 8 }}
                  labelStyle={{ color: '#FFFFF9' }}
                />
                <Line type="monotone" dataKey="count" stroke="#B58B67" strokeWidth={2} dot={{ fill: '#B58B67', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Top products bar chart */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm font-medium text-foreground mb-4">Top products</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.topProducts} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" stroke="#B58B67" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#B58B67" fontSize={11} width={90} />
                  <Tooltip
                    contentStyle={{ background: '#17332F', border: '1px solid hsl(172 25% 22%)', borderRadius: 8 }}
                    labelStyle={{ color: '#FFFFF9' }}
                  />
                  <Bar dataKey="quantity" fill="#B58B67" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Low stock alerts */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-destructive" />
                <p className="text-sm font-medium text-foreground">Low stock alerts</p>
              </div>

              {data.inventoryAlerts.length === 0 ? (
                <p className="text-xs" style={{ color: '#B58B67' }}>All stock levels healthy.</p>
              ) : (
                <div className="space-y-2">
                  {data.inventoryAlerts.map((alert, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-foreground">{alert.productName}</span>
                      <span className="text-destructive text-xs">
                        {alert.quantity} left (min {alert.threshold})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof DollarSign; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center mb-3">
        <Icon size={16} className="text-primary" />
      </div>
      <p className="text-xs" style={{ color: '#B58B67' }}>{label}</p>
      <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
    </div>
  )
}