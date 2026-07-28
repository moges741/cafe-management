import { useState, useEffect } from 'react';
import { ChefHat, Trash2, Search, ArrowRight, Save, Info, BookOpen } from 'lucide-react';
import { useGetProductsQuery } from '@/features/products/productsApi';
import {
  useGetRawMaterialsQuery,
  useGetRecipeQuery,
  useCreateOrUpdateRecipeMutation,
} from '@/features/inventory/inventoryWorkflowApi';
import { useCurrentBranch } from '@/hooks/useCurrentBranch';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface LocalIngredient {
  materialId: string;
  quantity: number;
}

export default function RecipeBuilderPage() {
  const { branchId } = useCurrentBranch();
  const { data: products = [], isLoading: isProductsLoading } = useGetProductsQuery({ branchId: branchId || '' }, { skip: !branchId });
  const { data: rawMaterials = [] } = useGetRawMaterialsQuery();
  const [createOrUpdateRecipe] = useCreateOrUpdateRecipeMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Selected product detail
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Fetch recipe for the selected product
  const { data: serverRecipe, refetch: refetchRecipe } = useGetRecipeQuery(selectedProductId || '', {
    skip: !selectedProductId,
  });

  // Local recipe state for editing
  const [localIngredients, setLocalIngredients] = useState<LocalIngredient[]>([]);

  // Add new ingredient inputs
  const [newMaterialId, setNewMaterialId] = useState('');
  const [newQuantity, setNewQuantity] = useState<number>(0);

  // Populate local recipe when server recipe is loaded
  useEffect(() => {
    if (serverRecipe) {
      setLocalIngredients(
        serverRecipe.ingredients.map((ing) => ({
          materialId: ing.materialId,
          quantity: ing.quantity,
        }))
      );
    } else {
      setLocalIngredients([]);
    }
  }, [serverRecipe]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIngredient = () => {
    if (!newMaterialId || newQuantity <= 0) {
      toast.error('Please select a material and enter a valid quantity');
      return;
    }

    if (localIngredients.some((i) => i.materialId === newMaterialId)) {
      toast.error('This ingredient is already in the recipe');
      return;
    }

    setLocalIngredients([...localIngredients, { materialId: newMaterialId, quantity: newQuantity }]);
    setNewMaterialId('');
    setNewQuantity(0);
  };

  const handleRemoveIngredient = (materialId: string) => {
    setLocalIngredients(localIngredients.filter((i) => i.materialId !== materialId));
  };

  const handleSaveRecipe = async () => {
    if (!selectedProductId) return;

    try {
      await createOrUpdateRecipe({
        productId: selectedProductId,
        ingredients: localIngredients,
      }).unwrap();
      toast.success('Recipe saved successfully');
      refetchRecipe();
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Failed to save recipe');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Recipe Builder (Bill of Materials)</h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: '#B58B67' }}>
          Map menu items to their raw ingredients. The system will automatically deduct these raw materials from the Kitchen Inventory on every completed sale.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left Side: Product Selector */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 sm:space-y-4 lg:col-span-1">
          <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <BookOpen size={18} className="text-[#c29570]" />
            Menu Items
          </h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 sm:py-1.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
            />
          </div>

          <div className="divide-y divide-border max-h-[250px] lg:max-h-[450px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {isProductsLoading ? (
              <p className="text-center py-6 text-xs sm:text-sm text-muted-foreground">Loading products...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center py-6 text-xs sm:text-sm text-muted-foreground">No products found</p>
            ) : (
              filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-xs sm:text-sm ${
                    selectedProductId === p.id
                      ? 'bg-[#c29570]/10 text-[#a3724c] font-semibold'
                      : 'hover:bg-muted/50 text-foreground'
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  <ArrowRight size={14} className={selectedProductId === p.id ? 'opacity-100' : 'opacity-0'} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Recipe Editor */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-5 sm:space-y-6">
          {selectedProduct ? (
            <div className="space-y-5 sm:space-y-6">
              {/* Product Info */}
              <div className="flex items-center gap-3 pb-3.5 border-b border-border">
                <ChefHat size={22} className="text-[#c29570] shrink-0" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">{selectedProduct.name} Recipe</h2>
                  <p className="text-xs text-muted-foreground">Category: {selectedProduct.category?.name}</p>
                </div>
              </div>

              {/* Add Ingredient Form */}
              <div className="bg-muted/30 border border-border p-3.5 sm:p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Add Ingredient
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Raw Material
                    </label>
                    <select
                      value={newMaterialId}
                      onChange={(e) => setNewMaterialId(e.target.value)}
                      className="w-full px-3 py-2 sm:py-1.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                    >
                      <option value="">-- Select Ingredient --</option>
                      {rawMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Quantity (in units)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={newQuantity || ''}
                        onChange={(e) => setNewQuantity(parseFloat(e.target.value))}
                        placeholder="e.g. 0.018"
                        className="w-full px-3 py-2 sm:py-1.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#c29570]"
                      />
                      <Button
                        onClick={handleAddIngredient}
                        className="bg-[#c29570] hover:bg-[#b08460] text-white rounded-xl text-xs sm:text-sm px-3"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Recipe Ingredients
                </h3>

                {localIngredients.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center border border-dashed border-border rounded-xl text-muted-foreground text-xs sm:text-sm flex flex-col items-center">
                    <Info size={22} className="mb-2 text-[#c29570] opacity-40" />
                    No ingredients added yet. Add items above to define the recipe.
                  </div>
                ) : (
                  <div className="divide-y divide-border border border-border rounded-xl bg-background overflow-hidden">
                    {localIngredients.map((item, idx) => {
                      const material = rawMaterials.find((m) => m.id === item.materialId);
                      return (
                        <div key={item.materialId} className="flex items-center justify-between p-3 sm:p-3.5 hover:bg-muted/10 transition-colors gap-2">
                          <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
                            <span className="text-xs text-muted-foreground font-mono shrink-0">#{idx + 1}</span>
                            <div className="truncate">
                              <div className="font-semibold text-xs sm:text-sm truncate">{material?.name ?? 'Unknown Material'}</div>
                              <div className="text-[11px] text-muted-foreground">Category: {material?.category}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                            <div className="font-bold text-xs sm:text-sm text-[#c29570]">
                              {item.quantity} <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{material?.unit}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveIngredient(item.materialId)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              title="Remove ingredient"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-3 border-t border-border">
                <Button
                  onClick={handleSaveRecipe}
                  className="w-full sm:w-auto bg-[#c29570] hover:bg-[#b08460] text-white rounded-xl flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm py-2.5 sm:py-2"
                >
                  <Save size={16} />
                  Save Recipe Config
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 sm:py-24 text-muted-foreground flex flex-col items-center justify-center px-4">
              <ChefHat size={40} className="mb-3 text-[#c29570] opacity-35" />
              <p className="text-base sm:text-lg font-medium text-foreground">Select a product from the list</p>
              <p className="text-xs sm:text-sm">Configure raw materials composition for auto-consumption.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
