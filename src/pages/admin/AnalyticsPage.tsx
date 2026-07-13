import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, ShoppingBag, DollarSign, AlertTriangle, Package } from 'lucide-react'
import { useGetDashboardQuery } from '@/features/analytics/analyticsApi'
import { cn } from '@/lib/utils'

const PERIODS = [
  { key: 'today',      label: 'Today' },
  { key: 'this_week',  label: 'This week' },
  { key: 'this_month', label: 'This month' },
]

const STATUS_COLORS: Record<string, string> = {
  pending:    '#5F5E5A',
  confirmed:  '#888780',
  in_kitchen: '#B58B67',
  ready:      '#0F6E56',
  completed:  '#1D9E75',
  cancelled:  '#E24B4A',
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('this_week')
  const { data, isLoading } = useGetDashboardQuery({ period })

  const statusData = data
    ? Object.entries(data.salesSummary.ordersByStatus).map(([status, count]) => ({
        name: status.replace('_', ' '),
        value: count,
        color: STATUS_COLORS[status] ?? '#888780',
      }))
    : []

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
            <MetricCard icon={DollarSign} label="Revenue" value={`${data.salesSummary.totalRevenue.toLocaleString()} ETB`} />
            <MetricCard icon={ShoppingBag} label="Orders" value={data.salesSummary.totalOrders.toLocaleString()} />
            <MetricCard icon={TrendingUp} label="Avg order value" value={`${Number(data.salesSummary.averageOrder).toFixed(0)} ETB`} />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Order volume — spans 2 columns */}
            <div className="col-span-2 bg-card border border-border rounded-2xl p-5">
              <p className="text-sm font-medium text-foreground mb-4">Order volume by day</p>
              {data.orderVolume.byDay.length === 0 ? (
                <p className="text-xs py-16 text-center" style={{ color: '#B58B67' }}>No orders in this period yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={data.orderVolume.byDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(172 25% 22%)" />
                    <XAxis dataKey="date" stroke="#B58B67" fontSize={11} />
                    <YAxis stroke="#B58B67" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: '#17332F', border: '1px solid hsl(172 25% 22%)', borderRadius: 8 }}
                      labelStyle={{ color: '#FFFFF9' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#B58B67" strokeWidth={2} dot={{ fill: '#B58B67', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Status breakdown pie */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm font-medium text-foreground mb-4">Orders by status</p>
              {statusData.every(s => s.value === 0) ? (
                <p className="text-xs py-16 text-center" style={{ color: '#B58B67' }}>No data yet.</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={statusData} dataKey="value" innerRadius={35} outerRadius={55} paddingAngle={2}>
                        {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#17332F', border: '1px solid hsl(172 25% 22%)', borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {statusData.map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 capitalize text-foreground">
                          <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                          {s.name}
                        </span>
                        <span style={{ color: '#B58B67' }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Top products */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm font-medium text-foreground mb-4">Top products</p>
              {data.topProducts.length === 0 ? (
                <p className="text-xs" style={{ color: '#B58B67' }}>No sales data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.topProducts} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" stroke="#B58B67" fontSize={11} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#B58B67" fontSize={11} width={90} />
                    <Tooltip
                      contentStyle={{ background: '#17332F', border: '1px solid hsl(172 25% 22%)', borderRadius: 8 }}
                      labelStyle={{ color: '#FFFFF9' }}
                      formatter={(value, name) => [value, name === 'unitsSold' ? 'Units sold' : name]}
                    />
                    <Bar dataKey="unitsSold" fill="#B58B67" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Inventory + low stock */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package size={16} className="text-primary" />
                <p className="text-sm font-medium text-foreground">Inventory consumption</p>
              </div>

              <div className="space-y-2 max-h-[160px] overflow-y-auto">
                {data.inventoryConsumption.map((item) => (
                  <div key={item.inventoryId} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.productName}</span>
                    <span style={{ color: '#B58B67' }}>{item.currentStock} {item.unit}</span>
                  </div>
                ))}
              </div>

              {data.lowStockAlerts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle size={13} className="text-destructive" />
                    <span className="text-xs font-medium text-destructive">Low stock</span>
                  </div>
                  {data.lowStockAlerts.map((alert, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-foreground">{alert.productName}</span>
                      <span className="text-destructive">{alert.quantity} left</span>
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