import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagePlus, X, Check, Loader2 } from 'lucide-react'
import { useCreateProductMutation, useUploadProductImagesMutation } from '@/features/products/productsApi'
import { useGetCategoriesQuery } from '@/features/categories/categoriesApi'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
const MAX_GALLERY = 3

export default function ProductCreatePage() {
  const navigate = useNavigate()
  const { branchId } = useCurrentBranch()
  const { data: categories = [] } = useGetCategoriesQuery({ branchId: branchId || undefined }, { skip: !branchId })
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [uploadImages, { isLoading: isUploading }] = useUploadProductImagesMutation()

  // Step tracking — image upload only unlocks once the product actually exists
  const [step, setStep] = useState<1 | 2>(1)
  const [createdProductId, setCreatedProductId] = useState<string | null>(null)
  const [createdProductName, setCreatedProductName] = useState('')

  // Step 1 fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')

  // Step 2 — cover + gallery
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

  const coverInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

const handleCreateDetails = async () => {
  if (!navigator.onLine) {
    toast.error('Network offline: Internet connection is required to create a product.', {
      icon: '📡',
      style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
    })
    return
  }

  if (!name || !price || !categoryId) {
    toast.error('Fill in name, price, and category')
    return
  }
  if (!branchId) {
    toast.error('No branch selected')
    return
  }

  try {
    // Ensure price is a number
    const priceNumber = parseFloat(price)
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast.error('Price must be a valid positive number')
      return
    }

    const payload = {
      name: name.trim(),
      description: description?.trim() || '',
      price: priceNumber,
      categoryId: categoryId.trim(),
      branchId: branchId.trim(),
    }

    const product = await createProduct(payload).unwrap()

    setCreatedProductId(product.id)
    setCreatedProductName(product.name)
    setStep(2)
    toast.success('Product created — now add photos')
  } catch (err: any) {
    if (err?.status === 'FETCH_ERROR' || !navigator.onLine) {
      toast.error('Network offline: Internet connection is required to create a product.')
    } else {
      const errorMessage =
        err?.data?.message ??
        err?.data?.error?.message ??
        err?.data?.error ??
        err?.message ??
        'Could not create product'

      toast.error(errorMessage)
    }
  }
}

  const handleCoverSelect = (file: File) => {
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleGallerySelect = (files: FileList) => {
    const remaining = MAX_GALLERY - galleryFiles.length
    const toAdd = Array.from(files).slice(0, remaining)
    setGalleryFiles(prev => [...prev, ...toAdd])
    setGalleryPreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))])
  }

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index))
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleFinish = async () => {
    if (!navigator.onLine) {
      toast.error('Network offline: Internet connection is required to upload product images.', {
        icon: '📡',
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
      })
      return
    }

    if (!createdProductId) return
    if (!coverFile) {
      toast.error('Add a main image before finishing')
      return
    }

    const formData = new FormData()
    formData.append('coverImage', coverFile)
    galleryFiles.forEach(f => formData.append('galleryImages', f))

    try {
      await uploadImages({ id: createdProductId, formData }).unwrap()
      toast.success('Product ready')
      navigate('/admin/products')
    } catch (err: any) {
      const message =
        err?.data?.message ??
        err?.data?.error?.message ??
        err?.data?.error ??
        err?.error ??
        'Image upload failed'

      toast.error(message)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        <StepDot active={step === 1} done={step > 1} label="Details" number={1} />
        <div className="w-8 h-px bg-border" />
        <StepDot active={step === 2} done={false} label="Photos" number={2} />
      </div>

      {step === 1 && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h1 className="text-xl font-bold text-foreground">New product</h1>

          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Pepperoni Nera"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Charred crust, spicy pepperoni, hot honey"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Price (ETB)</Label>
              <Input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="45"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="">Select active category</option>
                {categories.filter(c => c.isActive).length > 0 ? (
                  categories.filter(c => c.isActive).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <p className="text-xs text-destructive mt-1">
                    No active categories found — create one first from the Categories page.
                  </p>
                )}
              </select>
            </div>
          </div>

          <Button onClick={handleCreateDetails} disabled={isCreating} className="w-full">
            {isCreating ? 'Creating...' : 'Continue to photos'}
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Add photos</h1>
            <p className="text-xs mt-1" style={{ color: '#B58B67' }}>for {createdProductName}</p>
          </div>

          {/* Main / cover image — large, primary */}
          <div>
            <Label className="mb-2 block">Main image</Label>
            <p className="text-[11px] mb-2" style={{ color: '#B58B67' }}>
              This is the big image shown on the menu and at the top of the product page.
            </p>

            {coverPreview ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
                <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setCoverFile(null); setCoverPreview(null) }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/90 flex items-center justify-center"
                  aria-label="Remove main image"
                >
                  <X size={14} className="text-foreground" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => coverInputRef.current?.click()}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 transition-colors"
              >
                <ImagePlus size={26} />
                <span className="text-sm">Click to upload main image</span>
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleCoverSelect(e.target.files[0])}
            />
          </div>

          {/* Gallery — up to 3 detail images */}
          <div>
            <Label className="mb-2 block">Detail photos ({galleryFiles.length}/{MAX_GALLERY})</Label>
            <p className="text-[11px] mb-2" style={{ color: '#B58B67' }}>
              Extra angles customers can browse on the product detail page.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {galleryPreviews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={src} alt={`Detail ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/90 flex items-center justify-center"
                    aria-label="Remove image"
                  >
                    <X size={11} className="text-foreground" />
                  </button>
                </div>
              ))}

              {galleryFiles.length < MAX_GALLERY && (
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors"
                >
                  <ImagePlus size={18} />
                </button>
              )}
            </div>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleGallerySelect(e.target.files)}
            />
          </div>

          <Button onClick={handleFinish} disabled={isUploading || !coverFile} className="w-full">
            {isUploading ? (
              <><Loader2 size={15} className="mr-1.5 animate-spin" /> Uploading...</>
            ) : (
              <><Check size={15} className="mr-1.5" /> Finish</>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

function StepDot({ active, done, label, number }: { active: boolean; done: boolean; label: string; number: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
        done ? 'bg-primary text-primary-foreground' : active ? 'border-2 border-primary text-primary' : 'border border-border text-muted-foreground'
      )}>
        {done ? <Check size={12} /> : number}
      </div>
      <span className={cn('text-sm', active || done ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
    </div>
  )
}