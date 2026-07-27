import { useState } from 'react';
import { Plus, Edit2, Search, Tag } from 'lucide-react';
import {
  useGetRawMaterialsQuery,
  useCreateRawMaterialMutation,
  useUpdateRawMaterialMutation,
} from '@/features/inventory/inventoryWorkflowApi';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function RawMaterialsPage() {
  const { data: rawMaterials = [], isLoading } = useGetRawMaterialsQuery();
  const [createMaterial] = useCreateRawMaterialMutation();
  const [updateMaterial] = useUpdateRawMaterialMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Coffee');
  const [sku, setSku] = useState('');
  const [unit, setUnit] = useState('kg');
  const [minStockLevel, setMinStockLevel] = useState(10);
  const [description, setDescription] = useState('');

  const categories = [
    'Coffee',
    'Tea',
    'Dairy',
    'Meat',
    'Vegetables',
    'Fruits',
    'Bakery',
    'Spices',
    'Soft Drinks',
    'Packaging',
    'Cleaning Supplies',
    'Others',
  ];

  const units = ['kg', 'g', 'L', 'ml', 'pcs', 'bottle', 'can', 'packet', 'box', 'bag'];

  const filteredMaterials = rawMaterials.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.sku && m.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setName('');
    setCategory('Coffee');
    setSku('');
    setUnit('kg');
    setMinStockLevel(10);
    setDescription('');
    setEditingId(null);
  };

  const handleEditClick = (m: any) => {
    setEditingId(m.id);
    setName(m.name);
    setCategory(m.category);
    setSku(m.sku || '');
    setUnit(m.unit);
    setMinStockLevel(m.minStockLevel);
    setDescription(m.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !unit) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateMaterial({
          id: editingId,
          body: { name, category, sku: sku || null, unit, minStockLevel, description: description || null },
        }).unwrap();
        toast.success('Raw material updated');
      } else {
        await createMaterial({
          name,
          category,
          sku: sku || undefined,
          unit,
          minStockLevel,
          description: description || undefined,
        }).unwrap();
        toast.success('Raw material added to catalog');
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Failed to save material');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Raw Materials Catalog</h1>
          <p className="text-sm mt-1" style={{ color: '#B58B67' }}>
            Maintain the organization-wide master list of materials, ingredients, and packaging.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="rounded-xl flex items-center gap-2 bg-[#c29570] hover:bg-[#b08460] text-white"
        >
          <Plus size={18} />
          Add Raw Material
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search raw materials by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570] transition-all"
          />
        </div>
      </div>

      {/* Table/List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading catalog...</div>
        ) : filteredMaterials.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
            <Tag size={40} className="mb-3 text-[#c29570] opacity-40" />
            <p className="text-lg font-medium text-foreground">No raw materials found</p>
            <p className="text-sm mt-1">Add materials to start tracking your inventory.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4">Material Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4 text-center">Unit</th>
                  <th className="p-4 text-right">Min Stock Limit</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-foreground">{material.name}</div>
                        {material.description && (
                          <div className="text-xs text-muted-foreground mt-0.5">{material.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-[#c29570]/10 text-[#a3724c] rounded-full text-xs font-medium">
                        {material.category}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground font-mono text-xs">{material.sku ?? '—'}</td>
                    <td className="p-4 text-center font-semibold">{material.unit}</td>
                    <td className="p-4 text-right font-semibold text-amber-600">
                      {material.minStockLevel} {material.unit}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(material)}
                        className="rounded-xl border-[#c29570] text-[#c29570] hover:bg-[#c29570]/5"
                      >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Raw Material' : 'Add Raw Material'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Material Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whole Milk, Arabica Coffee Beans"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Measurement Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    SKU Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MILK-WHOLE-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Min Stock Threshold *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={minStockLevel}
                    onChange={(e) => setMinStockLevel(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional details about storage or sourcing..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#c29570] hover:bg-[#b08460] text-white rounded-xl">
                  {editingId ? 'Save Changes' : 'Add Material'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
