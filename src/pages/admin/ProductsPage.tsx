import { useState } from 'react'
import { Plus, Upload, ToggleLeft, ToggleRight } from 'lucide-react'
import { useGetProductsQuery, useCreateProductMutation, useToggleAvailabilityMutation, useUploadProductImagesMutation } from '@/features/products/productsApi'
import { useGetCategoriesQuery } from '@/features/categories/categoriesApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

export default function ProductsPage() {
  const { data: products = [] } = useGetProductsQuery({ branchId: BRANCH_ID })
  const { data: categories = [] } = useGetCategoriesQuery()
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [toggleAvailability] = useToggleAvailabilityMutation()
  const [uploadImages] = useUploadProductImagesMutation()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')

  const handleCreate = async () => {
    if (!name || !price || !categoryId) {
      toast.error('Fill in name, price, and category')
      return
    }
    try {
      await createProduct({
        name, description, categoryId,
        price: Number(price),
        branchId: BRANCH_ID,
      }).unwrap()
      toast.success('Product created')
      setName(''); setPrice(''); setCategoryId(''); setDescription('')
      setShowForm(false)
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Could not create product')
    }
  }

  const handleImageUpload = async (productId: string, files: FileList | null) => {
    if (!files || files.length === 0) return
    const formData = new FormData()
    formData.append('coverImage', files[0])
    try {
      await uploadImages({ id: productId, formData }).unwrap()
      toast.success('Image uploaded')
    } catch {
      toast.error('Upload failed')
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <Button onClick={() => setShowForm(s => !s)}>
          <Plus size={15} className="mr-1.5" /> New product
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-5 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Product name" value={name} onChange={e => setName(e.target.value)} />
            <Input placeholder="Price (ETB)" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          >
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create product'}
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 border border-border rounded-xl p-3 bg-card">
            <div className="w-14 h-14 rounded-lg bg-secondary overflow-hidden shrink-0">
              {product.imageUrl && <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{product.name}</p>
              <p className="text-xs" style={{ color: '#B58B67' }}>
                {product.category?.name} — {Number(product.price).toFixed(0)} ETB
              </p>
            </div>

            <label className="cursor-pointer text-xs flex items-center gap-1 text-primary shrink-0">
              <Upload size={13} />
              Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(product.id, e.target.files)}
              />
            </label>

            <button
              onClick={() => toggleAvailability(product.id)}
              className="shrink-0 text-primary"
              aria-label="Toggle availability"
            >
              {product.isAvailable ? <ToggleRight size={22} /> : <ToggleLeft size={22} className="text-muted-foreground" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}