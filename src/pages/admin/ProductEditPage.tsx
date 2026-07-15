import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ImagePlus, X, Check, Loader2, ArrowLeft, Trash } from 'lucide-react'
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductMutation,
} from '@/features/products/productsApi'
import { useGetCategoriesQuery } from '@/features/categories/categoriesApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import toast from 'react-hot-toast'

const MAX_GALLERY = 3

export default function ProductEditPage() {
  const { id: productId = '' } = useParams()
  const navigate = useNavigate()

  const { data: product, isLoading } = useGetProductByIdQuery(productId, { skip: !productId })
  const { data: categories = [] } = useGetCategoriesQuery()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const [uploadImages, { isLoading: isUploading }] = useUploadProductImagesMutation()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Form fields — start empty, get populated once the product loads
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')

  // Cover image — either the existing Cloudinary URL, or a newly picked File pending upload
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  // Gallery — existing URLs (already saved) shown separately from new files (pending upload)
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([])
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([])
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([])

  const coverInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // Populate the form once the product data arrives — this only needs to run
  // when `product` itself changes, not on every keystroke
  useEffect(() => {
    if (!product) return
    setName(product.name)
    setDescription(product.description ?? '')
    setPrice(String(product.price))
    setCategoryId(product.categoryId)
    setCoverPreview(product.imageUrl ?? null)
    setExistingGalleryUrls((product.images ?? []).map(img => img.url))
  }, [product])

  const totalGalleryCount = existingGalleryUrls.length + newGalleryFiles.length
  const gallerySlotsLeft = MAX_GALLERY - totalGalleryCount

  const handleCoverSelect = (file: File) => {
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleGallerySelect = (files: FileList) => {
    const toAdd = Array.from(files).slice(0, gallerySlotsLeft)
    if (toAdd.length === 0) return
    setNewGalleryFiles(prev => [...prev, ...toAdd])
    setNewGalleryPreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))])
  }

  const removeNewGalleryImage = (index: number) => {
    setNewGalleryFiles(prev => prev.filter((_, i) => i !== index))
    setNewGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Note: removing an already-saved gallery image isn't possible yet —
  // your backend's image upload is append-only, there's no delete endpoint.
  // Only newly picked files (not yet uploaded) can be removed here.

  const handleSave = async () => {
    if (!name.trim() || !price || !categoryId) {
      toast.error('Fill in name, price, and category')
      return
    }

    try {
      await updateProduct({
        id: productId,
        name,
        description: description || undefined,
        price: Number(price),
        categoryId,
      }).unwrap()

      // Only hit the image endpoint if something new was actually picked
      if (coverFile || newGalleryFiles.length > 0) {
        const formData = new FormData()
        if (coverFile) formData.append('coverImage', coverFile)
        newGalleryFiles.forEach(f => formData.append('galleryImages', f))

        await uploadImages({ id: productId, formData }).unwrap()
      }

      toast.success('Product updated')
      navigate('/admin/products')
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.error?.message || 'Update failed')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteProduct(productId).unwrap()
      toast.success('Product deleted')
      setIsDeleteDialogOpen(false)
      navigate('/admin/products')
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.error?.message || 'Delete failed')
    }
  }

  if (isLoading) {
    return <div className="p-6 text-foreground">Loading product...</div>
  }

  if (!product) {
    return <div className="p-6 text-foreground">Product not found.</div>
  }

  return (
    <div className="p-6 max-w-2xl">
      <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-primary mb-6">
        <ArrowLeft size={14} />
        Back to products
      </Link>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h1 className="text-xl font-bold text-foreground">Edit product</h1>

        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Pepperoni Nera" />
        </div>

        <div className="space-y-1.5">
          <Label>Description</Label>
          <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Charred crust, spicy pepperoni, hot honey" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Price (ETB)</Label>
            <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="45" />
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="">Select category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main image */}
        <div>
          <Label className="mb-2 block">Main image</Label>

          {coverPreview ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
              <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
              <button
                onClick={() => coverInputRef.current?.click()}
                className="absolute inset-0 bg-background/0 hover:bg-background/60 flex items-center justify-center text-transparent hover:text-foreground text-sm transition-colors"
              >
                Click to replace
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

        {/* Gallery */}
        <div>
          <Label className="mb-2 block">Detail photos ({totalGalleryCount}/{MAX_GALLERY})</Label>

          <div className="grid grid-cols-3 gap-3">
            {/* Already-saved images — read only, no remove button since backend has no delete endpoint yet */}
            {existingGalleryUrls.map((url, i) => (
              <div key={`existing-${i}`} className="aspect-square rounded-lg overflow-hidden border border-border">
                <img src={url} alt={`Saved detail ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}

            {/* Newly picked, not-yet-uploaded images — removable */}
            {newGalleryPreviews.map((src, i) => (
              <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-primary/50">
                <img src={src} alt={`New detail ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeNewGalleryImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/90 flex items-center justify-center"
                  aria-label="Remove image"
                >
                  <X size={11} className="text-foreground" />
                </button>
              </div>
            ))}

            {gallerySlotsLeft > 0 && (
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

        <div className="flex gap-3 pt-2">
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="destructive" disabled={isDeleting} className="w-1/3">
                {isDeleting ? <Loader2 size={15} className="mr-1.5 animate-spin" /> : <Trash size={15} className="mr-1.5" />}
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this product? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={isDeleting}>Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? <Loader2 size={15} className="mr-1.5 animate-spin" /> : <Trash size={15} className="mr-1.5" />}
                  Yes, Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave} disabled={isUpdating || isUploading || isDeleting} className="w-2/3">
            {isUpdating || isUploading ? (
              <><Loader2 size={15} className="mr-1.5 animate-spin" /> Saving...</>
            ) : (
              <><Check size={15} className="mr-1.5" /> Save changes</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}