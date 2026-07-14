import { Link } from 'react-router-dom'
import { ArrowRight, Package, ReceiptText, Tags, TriangleAlert, Sparkles, TrendingUp, TrendingDown, Users } from 'lucide-react'
import { useGetDashboardQuery } from '@/features/analytics/analyticsApi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetDashboardQuery({ period: 'this_week', branchId: BRANCH_ID })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <section className="rounded-3xl border border-border bg-card p-8 md:p-10 overflow-hidden relative shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(181,139,103,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(15,110,86,0.08),transparent_35%)]" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} /> Admin Command Center
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Welcome back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#b58b67]">Mr. Cafe</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl">
              Track your weekly sales, monitor live orders, manage stock pressure, and organize categories from one beautiful interface.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
            <QuickLink to="/admin/orders" label="Live Orders" icon={ReceiptText} />
            <QuickLink to="/admin/inventory" label="Inventory" icon={Package} />
            <QuickLink to="/admin/categories" label="Categories" icon={Tags} />
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 rounded-3xl bg-card animate-pulse border border-border" />)}
        </div>
      ) : data ? (
        <>
          {/* Key Metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            {/* Orders Status */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Order Status</h2>
                  <p className="text-sm text-muted-foreground">Snapshot of all orders this week</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <ReceiptText size={20} />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
                {Object.entries(data.salesSummary.ordersByStatus).map(([status, count]) => (
                  <div key={status} className="rounded-2xl border border-border bg-background p-4 flex flex-col justify-between hover:border-primary/30 transition-colors">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{status.replace('_', ' ')}</p>
                    <p className="mt-4 text-3xl font-extrabold text-foreground">{count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Stock Alerts</h2>
                  <p className="text-sm text-muted-foreground">Items needing attention</p>
                </div>
                <div className="p-2 bg-destructive/10 rounded-full text-destructive">
                  <TriangleAlert size={20} />
                </div>
              </div>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1" style={{ maxHeight: '200px' }}>
                {data.lowStockAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Package size={32} className="opacity-20 mb-2" />
                    <p className="text-sm">All stock levels are optimal.</p>
                  </div>
                ) : data.lowStockAlerts.map((alert) => (
                  <div key={alert.productName} className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-foreground">{alert.productName}</p>
                      <p className="text-xs font-medium text-destructive mt-0.5">Threshold: {alert.threshold}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-destructive leading-none">{alert.quantity}</span>
                      <p className="text-[10px] uppercase font-bold text-destructive/70 tracking-wider">Left</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            {/* Top Products */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Top Products</h2>
                  <p className="text-sm text-muted-foreground">Best sellers by revenue</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Sparkles size={20} />
                </div>
              </div>
              <div className="space-y-3">
                {data.topProducts.slice(0, 5).map((item, idx) => (
                  <div key={item.productId} className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.unitsSold} units sold</p>
                      </div>
                    </div>
                    <span className="text-sm text-primary font-extrabold">{item.revenue.toLocaleString()} ETB</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
                  <p className="text-sm text-muted-foreground">Manage operations</p>
                </div>
              </div>
              <div className="grid gap-4">
                <DashboardAction to="/admin/products/new" title="Create Product" description="Add new menu items with photos and prices" />
                <DashboardAction to="/admin/categories" title="Manage Categories" description="Organize your menu structure" />
                <DashboardAction to="/admin/inventory" title="Update Inventory" description="Restock items and fix low stock alerts" />
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}

function MetricCard({ label, value, icon: Icon, tone = 'default', trend }: { label: string; value: string; icon: any; tone?: 'default' | 'warn'; trend?: string }) {
  const isWarn = tone === 'warn'
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm relative overflow-hidden group">
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500",
        isWarn ? "bg-destructive" : "bg-primary"
      )} />
      
      <div className="relative flex justify-between items-start mb-4">
        <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{label}</p>
        <div className={cn("p-2 rounded-xl", isWarn ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
          <Icon size={18} />
        </div>
      </div>
      
      <div className="relative flex items-end gap-3">
        <p className={cn("text-3xl font-extrabold", isWarn ? "text-destructive" : "text-foreground")}>{value}</p>
        {trend && (
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full mb-1">
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}

function QuickLink({ to, label, icon: Icon }: { to: string; label: string; icon: any }) {
  return (
    <Link to={to} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border px-5 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary hover:shadow-md transition-all">
      <Icon size={18} />
      {label}
      <ArrowRight size={16} className="opacity-70" />
    </Link>
  )
}

function DashboardAction({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <Link to={to} className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 hover:border-primary hover:shadow-sm transition-all">
      <div>
        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{title}</p>
        <p className="text-xs mt-1 text-muted-foreground">{description}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <ArrowRight size={16} />
      </div>
    </Link>
  )
}