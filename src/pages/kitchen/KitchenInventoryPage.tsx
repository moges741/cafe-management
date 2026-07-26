import { useState, useMemo } from 'react';
import { Search, Send, Box, ShoppingBag } from 'lucide-react';
import {
  useGetKitchenStockQuery,
  useAdjustKitchenMutation,
  useGetRawMaterialsQuery,
  useCreateMaterialRequestMutation,
  useGetMaterialRequestsQuery,
} from '@/features/inventory/inventoryWorkflowApi';
import { useCurrentBranch } from '@/hooks/useCurrentBranch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function KitchenInventoryPage() {
  const { branchId } = useCurrentBranch();
  const { data: kitchenStock = [], isLoading: isStockLoading } = useGetKitchenStockQuery({ branchId: branchId || '' }, { skip: !branchId });
  const { data: rawMaterials = [] } = useGetRawMaterialsQuery();
  const { data: requests = [] } = useGetMaterialRequestsQuery({ branchId: branchId || undefined }, { skip: !branchId });
  const [adjustKitchen] = useAdjustKitchenMutation();
  const [createRequest] = useCreateMaterialRequestMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'stock' | 'requests'>('stock');

  // Daily Material Request Modal States
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestItems, setRequestItems] = useState<{ materialId: string; requestedQuantity: number }[]>([]);
  const [newMaterialId, setNewMaterialId] = useState('');
  const [newQty, setNewQty] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Damaged/Adjustment Modal States
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<any>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [reason, setReason] = useState('damaged'); // damaged, expired, consumption
  const [adjustNotes, setAdjustNotes] = useState('');

  const filteredStock = useMemo(() => {
    return kitchenStock.filter((item) =>
      item.material.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [kitchenStock, searchTerm]);

  const handleAddRequestItem = () => {
    if (!newMaterialId || newQty <= 0) {
      toast.error('Select a material and enter a positive quantity');
      return;
    }
    if (requestItems.some((item) => item.materialId === newMaterialId)) {
      toast.error('Material already added to request list');
      return;
    }
    setRequestItems([...requestItems, { materialId: newMaterialId, requestedQuantity: newQty }]);
    setNewMaterialId('');
    setNewQty(0);
  };

  const handleRemoveRequestItem = (matId: string) => {
    setRequestItems(requestItems.filter((i) => i.materialId !== matId));
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requestItems.length === 0) {
      toast.error('Please add at least one material to the request');
      return;
    }

    try {
      await createRequest({
        branchId: branchId || '',
        items: requestItems,
        notes: notes || undefined,
      }).unwrap();
      toast.success('Daily Material Request submitted to Admin');
      setIsRequestModalOpen(false);
      setRequestItems([]);
      setNotes('');
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Failed to submit request');
    }
  };

  const handleAdjustClick = (item: any) => {
    setSelectedStockItem(item);
    setAdjustQty(-1);
    setReason('damaged');
    setAdjustNotes('');
    setIsAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockItem || adjustQty === 0) return;

    try {
      await adjustKitchen({
        branchId: branchId || '',
        materialId: selectedStockItem.materialId,
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
          <h1 className="text-3xl font-bold text-foreground">Kitchen Operational Stock</h1>
          <p className="text-sm mt-1" style={{ color: '#B58B67' }}>
            Daily ingredients stock. Monitor remaining items and submit requests for Main Store transfers.
          </p>
        </div>

        <Button
          onClick={() => setIsRequestModalOpen(true)}
          className="rounded-xl flex items-center gap-2 bg-[#c29570] hover:bg-[#b08460] text-white"
        >
          <Send size={18} />
          Submit Daily request
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('stock')}
          className={cn(
            'px-5 py-2.5 text-sm font-semibold border-b-2 transition-all',
            activeTab === 'stock'
              ? 'border-[#c29570] text-[#c29570]'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Kitchen Stock
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={cn(
            'px-5 py-2.5 text-sm font-semibold border-b-2 transition-all',
            activeTab === 'requests'
              ? 'border-[#c29570] text-[#c29570]'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Request History
        </button>
      </div>

      {activeTab === 'stock' ? (
        <>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search kitchen inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570] transition-all"
              />
            </div>
          </div>

          {/* Kitchen stock list */}
          <div className="grid gap-3">
            {isStockLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-card animate-pulse border border-border" />
              ))
            ) : filteredStock.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border shadow-sm">
                <Box className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-foreground">Kitchen is out of stock</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Submit a Daily Material Request to draw ingredients from the Main Store.
                </p>
              </div>
            ) : (
              filteredStock.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-border bg-card hover:border-[#c29570]/40 transition-all duration-300 shadow-sm"
                >
                  <div>
                    <h3 className="text-base font-bold text-foreground">{item.material.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap text-sm">
                      <span className="font-semibold text-foreground">
                        {item.quantity} <span className="text-muted-foreground text-xs">{item.material.unit}</span>
                      </span>
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
        </>
      ) : (
        /* Requests History list */
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {requests.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
              <ShoppingBag size={40} className="mb-3 text-[#c29570] opacity-40" />
              <p className="text-lg font-medium text-foreground">No request records</p>
              <p className="text-sm mt-1">Your submitted daily material requests will be shown here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    <th className="p-4">Requested On</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Items count</th>
                    <th className="p-4">Requested By</th>
                    <th className="p-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-xs font-mono">{new Date(req.createdAt).toLocaleString()}</td>
                      <td className="p-4">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider',
                            req.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : req.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : req.status === 'partially_approved'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          )}
                        >
                          {req.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">{req.items.length} items</td>
                      <td className="p-4 text-muted-foreground">{req.requestedBy.firstName} {req.requestedBy.lastName}</td>
                      <td className="p-4 text-xs text-muted-foreground italic">{req.notes ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Daily Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">New Material Request</h2>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
              {/* Item Adder */}
              <div className="bg-muted/40 p-4 border border-border rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Add Item to List
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Material
                    </label>
                    <select
                      value={newMaterialId}
                      onChange={(e) => setNewMaterialId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                    >
                      <option value="">-- Select Material --</option>
                      {rawMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Quantity
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="any"
                        min="0.001"
                        placeholder="e.g. 5"
                        value={newQty || ''}
                        onChange={(e) => setNewQty(parseFloat(e.target.value))}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                      />
                      <Button type="button" onClick={handleAddRequestItem} className="bg-[#c29570] hover:bg-[#b08460] text-white">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Request Items List
                </h3>
                {requestItems.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic text-center py-4 border border-dashed border-border rounded-xl">
                    Request list is empty. Add materials above.
                  </p>
                ) : (
                  <div className="divide-y divide-border border border-border rounded-xl max-h-40 overflow-y-auto">
                    {requestItems.map((item) => {
                      const material = rawMaterials.find((m) => m.id === item.materialId);
                      return (
                        <div key={item.materialId} className="flex justify-between items-center p-2.5 text-sm bg-background">
                          <span>{material?.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="font-bold">
                              {item.requestedQuantity} <span className="text-xs text-muted-foreground">{material?.unit}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRequestItem(item.materialId)}
                              className="text-destructive hover:text-red-700 font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Request Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes for main store supervisor..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setIsRequestModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#c29570] hover:bg-[#b08460] text-white rounded-xl">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Item Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">Log Kitchen Waste / Loss</h2>
              <button onClick={() => setIsAdjustModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Material
                </label>
                <div className="p-3 bg-muted rounded-xl font-bold text-foreground">
                  {selectedStockItem?.material.name} ({selectedStockItem?.material.unit})
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
                    <option value="consumption">Food Preparation Consumption</option>
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
                <Button type="button" variant="ghost" onClick={() => setIsAdjustModalOpen(false)} className="rounded-xl">
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
