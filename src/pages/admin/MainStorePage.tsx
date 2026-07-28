import { useState, useMemo } from 'react';
import { Plus, Minus, Search, Database, AlertCircle, History, X } from 'lucide-react';
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
  const { data: stockItems = [], isLoading } = useGetMainStoreStockQuery(branchId ? { branchId } : undefined);
  const { data: transactions = [] } = useGetTransactionHistoryQuery(branchId ? { branchId } : undefined);
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Main Store Inventory</h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: '#B58B67' }}>
            Central warehouse management. Add purchases, log damaged items, and track total organization inventory.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:flex items-center gap-3 sm:gap-4 bg-card p-3 sm:px-4 sm:py-3 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-2.5 sm:gap-3 pr-2 sm:pr-4 border-r border-border">
            <div className="p-2 bg-[#c29570]/10 rounded-xl text-[#c29570]">
              <Database size={18} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tracked Items</p>
              <p className="text-base sm:text-lg font-bold text-foreground">{stockItems.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 bg-destructive/10 rounded-xl text-destructive">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Low Stock Alert</p>
              <p className="text-base sm:text-lg font-bold text-destructive">{lowStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs (Mobile Scrollable) */}
      <div className="flex border-b border-border gap-2 overflow-x-auto scrollbar-none whitespace-nowrap pb-1">
        <button
          onClick={() => setActiveTab('inventory')}
          className={cn(
            'px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0',
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
            'px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0',
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
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-3 sm:p-4 rounded-2xl border border-border shadow-sm">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search Main Store by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570] transition-all"
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
              <div className="text-center py-12 sm:py-16 bg-card rounded-2xl border border-border shadow-sm px-4">
                <Database className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/30 mb-3" />
                <p className="text-base sm:text-lg font-medium text-foreground">No inventory records</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
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
                      'flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm gap-3',
                      isLow ? 'bg-destructive/5 border-destructive/30 hover:border-destructive/60' : 'bg-card border-border hover:border-[#c29570]/40'
                    )}
                  >
                    <div>
                      <h3 className="text-base font-bold text-foreground">{item.material.name}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap text-xs sm:text-sm">
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
                    <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAdjustClick(item, 'subtract')}
                        className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5 text-xs py-2 sm:py-1.5"
                      >
                        <Minus size={14} className="mr-1" />
                        Loss
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAdjustClick(item, 'add')}
                        className="rounded-xl border-[#c29570] text-[#c29570] hover:bg-[#c29570]/5 text-xs py-2 sm:py-1.5"
                      >
                        <Plus size={14} className="mr-1" />
                        Receive
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
            <div className="p-12 sm:p-16 text-center text-muted-foreground flex flex-col items-center px-4">
              <History size={36} className="mb-3 text-[#c29570] opacity-40" />
              <p className="text-base sm:text-lg font-medium text-foreground">No transaction history</p>
              <p className="text-xs sm:text-sm mt-1">Material movements and stock adjustments will be listed here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full border-collapse text-left text-xs sm:text-sm min-w-[650px]">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-muted-foreground text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                    <th className="p-3 sm:p-4">Timestamp</th>
                    <th className="p-3 sm:p-4">Material</th>
                    <th className="p-3 sm:p-4">Action</th>
                    <th className="p-3 sm:p-4 text-right">Quantity</th>
                    <th className="p-3 sm:p-4">Flow</th>
                    <th className="p-3 sm:p-4">Actor</th>
                    <th className="p-3 sm:p-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((t) => {
                    const isPositive = t.quantity > 0;
                    return (
                      <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 sm:p-4 text-[11px] sm:text-xs text-muted-foreground font-mono whitespace-nowrap">
                          {new Date(t.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3 sm:p-4 font-bold text-foreground whitespace-nowrap">{t.material.name}</td>
                        <td className="p-3 sm:p-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider',
                              t.type === 'transfer'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                : t.type === 'purchase'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                            )}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className={cn('p-3 sm:p-4 text-right font-bold whitespace-nowrap', isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
                          {isPositive ? '+' : ''}
                          {t.quantity} {t.material.unit}
                        </td>
                        <td className="p-3 sm:p-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                          {t.source} ➔ {t.destination}
                        </td>
                        <td className="p-3 sm:p-4 text-muted-foreground text-xs whitespace-nowrap">{t.actor?.email ?? 'System'}</td>
                        <td className="p-3 sm:p-4 text-xs text-muted-foreground italic max-w-[200px] truncate">{t.notes ?? '—'}</td>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-auto">
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <h2 className="text-lg sm:text-xl font-bold">Adjust Main Store Stock</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdjustmentSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Selected Material
                </label>
                <div className="p-3 bg-muted rounded-xl font-bold text-foreground text-sm">
                  {selectedMaterial?.name} ({selectedMaterial?.unit})
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  Audit Notes / Description
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Provide details for this stock update..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#c29570] hover:bg-[#b08460] text-white rounded-xl w-full sm:w-auto">
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
