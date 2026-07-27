import { useState, useMemo } from 'react';
import { Search, Box, ArrowDownRight, History, Store, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  useGetKitchenStockQuery,
  useGetMainStoreStockQuery,
  useAdjustKitchenMutation,
  useTakeFromMainStoreMutation,
  useGetTransactionHistoryQuery,
} from '@/features/inventory/inventoryWorkflowApi';
import { useCurrentBranch } from '@/hooks/useCurrentBranch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function KitchenInventoryPage() {
  const { branchId } = useCurrentBranch();

  // Queries
  const { data: kitchenStock = [], isLoading: isStockLoading } = useGetKitchenStockQuery(
    { branchId: branchId || '' },
    { skip: !branchId },
  );
  const { data: mainStoreStock = [], isLoading: isMainStoreLoading } = useGetMainStoreStockQuery(
    { branchId: branchId || '' },
    { skip: !branchId },
  );
  const { data: transactions = [], isLoading: isHistoryLoading } = useGetTransactionHistoryQuery(
    { branchId: branchId || undefined },
    { skip: !branchId },
  );

  // Mutations
  const [adjustKitchen] = useAdjustKitchenMutation();
  const [takeFromMainStore, { isLoading: isTaking }] = useTakeFromMainStoreMutation();

  // Tabs: 'kitchen_stock' | 'main_store' | 'history'
  const [activeTab, setActiveTab] = useState<'kitchen_stock' | 'main_store' | 'history'>('kitchen_stock');
  const [searchTerm, setSearchTerm] = useState('');

  // Take / Withdraw Modal States
  const [isTakeModalOpen, setIsTakeModalOpen] = useState(false);
  const [selectedMainStoreItem, setSelectedMainStoreItem] = useState<any>(null);
  const [takeQty, setTakeQty] = useState<number>(0);
  const [takeNotes, setTakeNotes] = useState('');

  // Damage / Waste Adjustment Modal States
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedKitchenItem, setSelectedKitchenItem] = useState<any>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [reason, setReason] = useState('damaged');
  const [adjustNotes, setAdjustNotes] = useState('');

  // Filtered Kitchen Stock
  const filteredKitchenStock = useMemo(() => {
    return kitchenStock.filter((item) =>
      item.material.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [kitchenStock, searchTerm]);

  // Filtered Main Store Stock
  const filteredMainStoreStock = useMemo(() => {
    return mainStoreStock.filter((item) =>
      item.material.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [mainStoreStock, searchTerm]);

  // Open Withdraw Modal
  const handleOpenTakeModal = (mainStoreItem: any) => {
    setSelectedMainStoreItem(mainStoreItem);
    setTakeQty(1);
    setTakeNotes('');
    setIsTakeModalOpen(true);
  };

  // Submit Withdraw
  const handleTakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMainStoreItem || takeQty <= 0) {
      toast.error('Please enter a valid quantity greater than 0');
      return;
    }

    if (takeQty > selectedMainStoreItem.quantity) {
      toast.error(
        `Cannot withdraw ${takeQty} ${selectedMainStoreItem.material.unit}. Available in Main Store: ${selectedMainStoreItem.quantity}`,
      );
      return;
    }

    try {
      await takeFromMainStore({
        branchId: branchId || '',
        materialId: selectedMainStoreItem.materialId,
        quantity: takeQty,
        notes: takeNotes || undefined,
      }).unwrap();

      toast.success(`Successfully withdrew ${takeQty} ${selectedMainStoreItem.material.unit} to Kitchen!`);
      setIsTakeModalOpen(false);
      setSelectedMainStoreItem(null);
      setTakeQty(0);
      setTakeNotes('');
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.data?.error?.message ?? 'Failed to withdraw from store');
    }
  };

  // Open Damage Modal
  const handleAdjustClick = (item: any) => {
    setSelectedKitchenItem(item);
    setAdjustQty(-1);
    setReason('damaged');
    setAdjustNotes('');
    setIsAdjustModalOpen(true);
  };

  // Submit Damage
  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKitchenItem || adjustQty === 0) return;

    try {
      await adjustKitchen({
        branchId: branchId || '',
        materialId: selectedKitchenItem.materialId,
        delta: adjustQty,
        reason,
        note: adjustNotes || undefined,
      }).unwrap();

      toast.success('Kitchen stock updated');
      setIsAdjustModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Failed to adjust kitchen stock');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kitchen Inventory & Store Withdrawal</h1>
          <p className="text-sm mt-1" style={{ color: '#B58B67' }}>
            View Main Store inventory, directly withdraw ingredients to kitchen, and track transaction history.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('kitchen_stock')}
          className={cn(
            'px-5 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2',
            activeTab === 'kitchen_stock'
              ? 'border-[#c29570] text-[#c29570]'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <Box size={16} />
          Kitchen Operational Stock
        </button>
        <button
          onClick={() => setActiveTab('main_store')}
          className={cn(
            'px-5 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2',
            activeTab === 'main_store'
              ? 'border-[#c29570] text-[#c29570]'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <Store size={16} />
          Main Store (Take Ingredients)
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'px-5 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2',
            activeTab === 'history'
              ? 'border-[#c29570] text-[#c29570]'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <History size={16} />
          Transaction Logs
        </button>
      </div>

      {/* Search Input */}
      {activeTab !== 'history' && (
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder={
                activeTab === 'kitchen_stock'
                  ? 'Search kitchen inventory...'
                  : 'Search main store catalog...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570] transition-all"
            />
          </div>
        </div>
      )}

      {/* TAB 1: Kitchen Operational Stock */}
      {activeTab === 'kitchen_stock' && (
        <div className="grid gap-3">
          {isStockLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-card animate-pulse border border-border" />
            ))
          ) : filteredKitchenStock.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border shadow-sm">
              <Box className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-foreground">Kitchen is out of stock</p>
              <p className="text-sm text-muted-foreground mt-1">
                Go to the "Main Store" tab to withdraw ingredients directly into kitchen stock.
              </p>
            </div>
          ) : (
            filteredKitchenStock.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-border bg-card hover:border-[#c29570]/40 transition-all duration-300 shadow-sm"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground">{item.material.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap text-sm">
                    <span className="font-semibold text-foreground">
                      {item.quantity}{' '}
                      <span className="text-muted-foreground text-xs">{item.material.unit}</span>
                    </span>
                    {item.quantity <= item.material.minStockLevel && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center gap-1">
                        <AlertTriangle size={12} /> Low Stock Threshold ({item.material.minStockLevel})
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 sm:mt-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAdjustClick(item)}
                    className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5"
                  >
                    Log Damage / Expired
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Main Store Stock (Take / Withdraw Ingredients) */}
      {activeTab === 'main_store' && (
        <div className="grid gap-3">
          {isMainStoreLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-card animate-pulse border border-border" />
            ))
          ) : filteredMainStoreStock.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border shadow-sm">
              <Store className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-foreground">No ingredients available in Main Store</p>
              <p className="text-sm text-muted-foreground mt-1">
                Admin must populate or adjust the Main Store central inventory first.
              </p>
            </div>
          ) : (
            filteredMainStoreStock.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-border bg-card hover:border-[#c29570]/40 transition-all duration-300 shadow-sm"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground">{item.material.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="text-muted-foreground">Main Store Available:</span>
                    <span
                      className={cn(
                        'font-bold text-base',
                        item.quantity > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive',
                      )}
                    >
                      {item.quantity} {item.material.unit}
                    </span>
                  </div>
                </div>

                <div className="mt-3 sm:mt-0">
                  <Button
                    disabled={item.quantity <= 0}
                    onClick={() => handleOpenTakeModal(item)}
                    className="rounded-xl flex items-center gap-2 bg-[#c29570] hover:bg-[#b08460] text-white disabled:opacity-50"
                  >
                    <ArrowDownRight size={18} />
                    Take Ingredient
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Transaction Logs History (Both Kitchen & Admin side) */}
      {activeTab === 'history' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {isHistoryLoading ? (
            <div className="p-12 text-center text-muted-foreground">Loading transaction logs...</div>
          ) : transactions.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
              <History size={40} className="mb-3 text-[#c29570] opacity-40" />
              <p className="text-lg font-medium text-foreground">No transaction records</p>
              <p className="text-sm mt-1">All ingredient movements and withdrawals will be logged here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Raw Material</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Route (Source → Destination)</th>
                    <th className="p-4">Action Type</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-xs font-mono text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-foreground">{tx.material.name}</td>
                      <td className="p-4 font-semibold">
                        <span
                          className={cn(
                            tx.quantity > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive',
                          )}
                        >
                          {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity} {tx.material.unit}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-medium">
                        <span className="bg-muted px-2 py-1 rounded-md text-foreground">
                          {tx.source} → {tx.destination}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="uppercase text-xs tracking-wider px-2 py-0.5 rounded-full font-bold bg-muted text-foreground">
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">
                        {tx.actor ? `${tx.actor.firstName ?? ''} ${tx.actor.lastName ?? ''} (${tx.actor.email})` : 'System'}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground italic">{tx.notes ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* WITHDRAW INGREDIENT MODAL */}
      {isTakeModalOpen && selectedMainStoreItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">Withdraw Ingredient to Kitchen</h2>
              <button
                onClick={() => setIsTakeModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTakeSubmit} className="p-6 space-y-4">
              <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-1">
                <div className="text-xs uppercase font-bold text-muted-foreground">Material Name</div>
                <div className="text-lg font-bold text-foreground">{selectedMainStoreItem.material.name}</div>
                <div className="text-xs text-muted-foreground flex justify-between pt-1">
                  <span>Available in Main Store:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedMainStoreItem.quantity} {selectedMainStoreItem.material.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Withdraw Quantity ({selectedMainStoreItem.material.unit})
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.001"
                  max={selectedMainStoreItem.quantity}
                  required
                  placeholder={`Max: ${selectedMainStoreItem.quantity}`}
                  value={takeQty || ''}
                  onChange={(e) => setTakeQty(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Must be less than or equal to existing store amount ({selectedMainStoreItem.quantity}).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Daily morning preparation..."
                  value={takeNotes}
                  onChange={(e) => setTakeNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsTakeModalOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isTaking}
                  className="bg-[#c29570] hover:bg-[#b08460] text-white rounded-xl flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  {isTaking ? 'Withdrawing...' : 'Confirm Withdraw'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAMAGE / WASTE MODAL */}
      {isAdjustModalOpen && selectedKitchenItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">Log Kitchen Waste / Damage</h2>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Material
                </label>
                <div className="p-3 bg-muted rounded-xl font-bold text-foreground">
                  {selectedKitchenItem?.material.name} ({selectedKitchenItem?.material.unit})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Deduction Quantity
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. -2"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Reason
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                  >
                    <option value="damaged">Damage / Spillage</option>
                    <option value="expired">Expiration Waste</option>
                    <option value="consumption">Food Prep Consumption</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Audit Notes
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain why this kitchen stock is being updated..."
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#c29570] hover:bg-[#b08460] text-white rounded-xl">
                  Confirm Deduction
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
