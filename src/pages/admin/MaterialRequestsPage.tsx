import { useState } from 'react';
import { Check, X, Search, ShoppingBag } from 'lucide-react';
import {
  useGetMaterialRequestsQuery,
  useReviewMaterialRequestMutation,
} from '@/features/inventory/inventoryWorkflowApi';
import { useCurrentBranch } from '@/hooks/useCurrentBranch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function MaterialRequestsPage() {
  const { branchId } = useCurrentBranch();
  const { data: requests = [], isLoading } = useGetMaterialRequestsQuery({ branchId: branchId || undefined }, { skip: !branchId });
  const [reviewRequest] = useReviewMaterialRequestMutation();

  const [searchTerm, setSearchTerm] = useState('');

  // Review Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [approvedQuantities, setApprovedQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');

  const filteredRequests = requests.filter((r) =>
    `${r.requestedBy.firstName} ${r.requestedBy.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenReview = (req: any) => {
    setSelectedRequest(req);
    // Initialize approved quantities with requested quantities
    const initialQtys: Record<string, number> = {};
    req.items.forEach((item: any) => {
      initialQtys[item.materialId] = item.requestedQuantity;
    });
    setApprovedQuantities(initialQtys);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleQtyChange = (materialId: string, val: number) => {
    setApprovedQuantities({
      ...approvedQuantities,
      [materialId]: val,
    });
  };

  const handleReviewSubmit = async (status: 'approved' | 'partially_approved' | 'rejected') => {
    if (!selectedRequest) return;

    try {
      const itemsPayload = Object.entries(approvedQuantities).map(([materialId, approvedQuantity]) => ({
        materialId,
        approvedQuantity,
      }));

      await reviewRequest({
        id: selectedRequest.id,
        body: {
          status,
          items: status === 'rejected' ? undefined : itemsPayload,
          notes: notes || undefined,
        },
      }).unwrap();

      toast.success(`Request ${status} successfully`);
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Failed to review request');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Kitchen Material Requests</h1>
        <p className="text-sm mt-1" style={{ color: '#B58B67' }}>
          Review, approve, partially approve, or reject material transfer requests from the kitchen department.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search requests by requester name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570] transition-all"
          />
        </div>
      </div>

      {/* Request Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
            <ShoppingBag size={40} className="mb-3 text-[#c29570] opacity-40" />
            <p className="text-lg font-medium text-foreground">No material requests found</p>
            <p className="text-sm mt-1">Pending kitchen requests will be shown here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4">Requested On</th>
                  <th className="p-4">Requester</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Notes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-xs font-mono">{new Date(req.createdAt).toLocaleString()}</td>
                    <td className="p-4 font-bold">
                      {req.requestedBy.firstName} {req.requestedBy.lastName}
                    </td>
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
                    <td className="p-4 font-semibold">{req.items.length} materials</td>
                    <td className="p-4 text-xs text-muted-foreground italic truncate max-w-xs">{req.notes ?? '—'}</td>
                    <td className="p-4 text-right">
                      {req.status === 'pending' ? (
                        <Button
                          size="sm"
                          onClick={() => handleOpenReview(req)}
                          className="bg-[#c29570] hover:bg-[#b08460] text-white rounded-xl"
                        >
                          Review & Process
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">Review Material Request</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="flex justify-between items-center bg-muted/40 p-3 rounded-xl border border-border">
                <div>
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">Requester</span>
                  <span className="font-semibold text-sm">
                    {selectedRequest.requestedBy.firstName} {selectedRequest.requestedBy.lastName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">Timestamp</span>
                  <span className="text-xs font-mono">{new Date(selectedRequest.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {selectedRequest.notes && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-xs italic">
                  <strong>Notes:</strong> {selectedRequest.notes}
                </div>
              )}

              {/* Items Review List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Requested Materials & Approved Quantity Configuration
                </h3>

                <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-background">
                  {selectedRequest.items.map((item: any) => (
                    <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-sm text-foreground">{item.material.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Requested: <strong className="text-foreground">{item.requestedQuantity} {item.material.unit}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-muted-foreground">Approved Qty:</label>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={approvedQuantities[item.materialId] ?? 0}
                          onChange={(e) => handleQtyChange(item.materialId, parseFloat(e.target.value))}
                          className="w-24 px-2 py-1 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                        />
                        <span className="text-xs font-bold text-muted-foreground font-mono">{item.material.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Response Notes / Audit remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Reason for partial approval or rejection..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4 border-t border-border">
                <Button
                  onClick={() => handleReviewSubmit('rejected')}
                  className="bg-destructive hover:bg-destructive/90 text-white rounded-xl sm:order-first"
                >
                  <X size={16} className="mr-1" />
                  Reject Request
                </Button>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl">
                    Close
                  </Button>
                  <Button
                    onClick={() => handleReviewSubmit('partially_approved')}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  >
                    Partially Approve
                  </Button>
                  <Button
                    onClick={() => handleReviewSubmit('approved')}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  >
                    <Check size={16} className="mr-1" />
                    Full Approval
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
