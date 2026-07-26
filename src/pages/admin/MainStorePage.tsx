import { useState, useMemo } from 'react';
import { Plus, Minus, Search, ArrowUpRight, Ban, Eye, Database, AlertCircle, History } from 'lucide-react';
import {
  useGetMainStoreStockQuery,
  useAdjustMainStoreMutation,
  useGetTransactionHistoryQuery,
} from '@/features/inventory/inventoryWorkflowApi';
import { useCurrentBranch } from '@/hooks/useCurrentBranch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function MainStorePage() {
  const { branchId } = useCurrentBranch();
  const { data: stockItems = [], isLoading } = useGetMainStoreStockQuery({ branchId: branchId || '' }, { skip: !branchId });
  const { data: transactions = [] } = useGetTransactionHistoryQuery({ branchId: branchId || undefined }, { skip: !branchId });
  const [adjustMainStore] = useAdjustMainStoreMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');

  // Adjustment Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [delta, setDelta] = useState<number>(0);
  const [reason, setReason] = useState<string>('purchase');
  const [note, setNote] = useState<string>('');

  const filteredStock = useMemo(() => {
    return stockItems.filter((item) =>
      item.material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.material.sku && item.material.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [stockItems, searchTerm]);

  const lowStockCount = stockItems.filter((i) => i.quantity <= i.material.minStockLevel).length;

  const handleAdjustClick = (item: any, type: 'add' | 'subtract') => {
    setSelectedMaterial(item.material);
    setDelta(type === 'add' ? 10 : -10);
    setReason(type === 'add' ? 'purchase' : 'damaged');
    setNote('');
    setIsModalOpen(true);
  };

  const handleAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || delta === 0) return;

    try {
      await adjustMainStore({
        branchId: branchId || '',
        materialId: selectedMaterial.id,
        delta,
        reason,
        note: note || undefined,
      }).unwrap();
      toast.success('Main Store stock updated successfully');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Adjustment failed');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Main Store Inventory</h1>
          <p className="text-sm mt-1" style={{ color: '#B58B67' }}>
            Central warehouse management. Add purchases, log damaged items, and track total organization inventory.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 bg-card px-4 py-3 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 pr-4 border-r border-border">
            <div className="p-2 bg-[#c29570]/10 rounded-xl text-[#c29570]">
              <Database size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tracked Items</p>
              <p className="text-lg font-bold text-foreground">{stockItems.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-xl text-destructive">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Low Stock Alert</p>
              <p className="text-lg font-bold text-destructive">{lowStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('inventory')}
          className={cn(
            'px-5 py-2.5 text-sm font-semibold border-b-2 transition-all',
            activeTab === 'inventory'
              ? 'border-[#c29570] text-[#c29570]'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Inventory List
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'px-5 py-2.5 text-sm font-semibold border-b-2 transition-all',
            activeTab === 'history'
              ? 'border-[#c29570] text-[#c29570]'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Audit Ledger History
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search Main Store by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570] transition-all"
              />
            </div>
          </div>

          {/* Catalog grid */}
          <div className="grid gap-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-card animate-pulse border border-border" />
              ))
            ) : filteredStock.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border shadow-sm">
                <Database className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-foreground">No inventory records</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add raw materials in the Raw Materials catalog, then adjust quantities here to begin tracking.
                </p>
              </div>
            ) : (
              filteredStock.map((item) => {
                const isLow = item.quantity <= item.material.minStockLevel;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md',
                      isLow ? 'bg-destructive/5 border-destructive/30 hover:border-destructive/60' : 'bg-card border-border hover:border-[#c29570]/40'
                    )}
                  >
                    <div>
                      <h3 className="text-base font-bold text-foreground">{item.material.name}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap text-sm">
                        <span className="font-semibold text-foreground">
                          {item.quantity} <span className="text-muted-foreground text-xs">{item.material.unit}</span>
                        </span>
                        <span className="text-border text-xs">•</span>
                        <span className="text-xs text-muted-foreground">Min Limit: {item.material.minStockLevel}</span>
                        {isLow && (
                          <span className="bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Low Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick adjust buttons */}
                    <div className="flex gap-2 mt-3 sm:mt-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAdjustClick(item, 'subtract')}
                        className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5"
                      >
                        <Minus size={14} className="mr-1" />
                        Wastage / Loss
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAdjustClick(item, 'add')}
                        className="rounded-xl border-[#c29570] text-[#c29570] hover:bg-[#c29570]/5"
                      >
                        <Plus size={14} className="mr-1" />
                        Receive Stock
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        /* History logs */
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {transactions.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
              <History size={40} className="mb-3 text-[#c29570] opacity-40" />
              <p className="text-lg font-medium text-foreground">No transaction history</p>
              <p className="text-sm mt-1">Material movements and stock adjustments will be listed here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Material</th>
                    <th className="p-4">Action Type</th>
                    <th className="p-4 text-right">Quantity</th>
                    <th className="p-4">Flow</th>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((t) => {
                    const isPositive = t.quantity > 0;
                    return (
                      <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 text-xs text-muted-foreground font-mono">
                          {new Date(t.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4 font-bold text-foreground">{t.material.name}</td>
                        <td className="p-4">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider',
                              t.type === 'transfer'
                                ? 'bg-blue-100 text-blue-800'
                                : t.type === 'purchase'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            )}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className={cn('p-4 text-right font-bold', isPositive ? 'text-green-600' : 'text-red-500')}>
                          {isPositive ? '+' : ''}
                          {t.quantity} {t.material.unit}
                        </td>
                        <td className="p-4 text-xs font-mono text-muted-foreground">
                          {t.source} ➔ {t.destination}
                        </td>
                        <td className="p-4 text-muted-foreground">{t.actor?.email ?? 'System'}</td>
                        <td className="p-4 text-xs text-muted-foreground italic">{t.notes ?? '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Adjustment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">Adjust Main Store Quantity</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustmentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Selected Material
                </label>
                <div className="p-3 bg-muted rounded-xl font-bold text-foreground">
                  {selectedMaterial?.name} ({selectedMaterial?.unit})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Adjustment Quantity
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={delta}
                    onChange={(e) => setDelta(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Reason Category
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                  >
                    <option value="purchase">Purchase Delivery</option>
                    <option value="adjustment">Count Correction</option>
                    <option value="damaged">Damage / Spillage</option>
                    <option value="expired">Expiration Waste</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Audit Notes / Reason Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide details for this stock update..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#c29570] hover:bg-[#b08460] text-white rounded-xl">
                  Save Adjustment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
