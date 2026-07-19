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

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([])
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([])
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([])

  const coverInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

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
    return (
      <div className="min-h-screen bg-[#050301] flex items-center justify-center p-6">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050301] flex items-center justify-center p-6 text-neutral-300">
        Product not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050301] relative overflow-hidden flex justify-center py-12 px-6">
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-900/20 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-950/40 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="relative z-10 w-full max-w-2xl">
        <Link 
          to="/admin/products" 
          className="inline-flex items-center gap-1.5 text-sm text-amber-500/80 hover:text-amber-400 hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all mb-6"
        >
          <ArrowLeft size={14} />
          Back to products
        </Link>

        {/* Main Glassmorphic Card */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl hover:border-white/20 transition-all duration-500 group">
          <div className="border-b border-gradient-to-r from-amber-500/10 via-amber-400/30 to-amber-500/10 pb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500 text-transparent bg-clip-text inline-block">
              Edit Product
            </h1>
          </div>

          <div className="space-y-1.5">
            <Label className="text-neutral-300">Name</Label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Pepperoni Nera" 
              className="bg-white/5 border-white/10 text-neutral-300 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:border-amber-500 transition-shadow"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-neutral-300">Description</Label>
            <Input 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Charred crust, spicy pepperoni, hot honey" 
              className="bg-white/5 border-white/10 text-neutral-300 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:border-amber-500 transition-shadow"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-neutral-300">Price (ETB)</Label>
              <Input 
                type="number" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                placeholder="45" 
                className="bg-white/5 border-white/10 text-neutral-300 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:border-amber-500 transition-shadow"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-neutral-300">Category</Label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full h-10 rounded-md border border-white/10 bg-[#1a1a1a] px-3 text-sm text-neutral-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none"
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
            <Label className="mb-2 block text-neutral-300">Main image</Label>

            {coverPreview ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 group/img hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300">
                <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute inset-0 bg-[#050301]/70 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-amber-400 text-sm font-medium transition-all duration-300"
                >
                  <ImagePlus size={24} className="mb-2" />
                  Click to replace
                </button>
              </div>
            ) : (
              <button
                onClick={() => coverInputRef.current?.click()}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center gap-2 text-white/60 hover:text-amber-400 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300"
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
            <Label className="mb-3 block text-neutral-300">
              Detail photos <span className="text-amber-500/80">({totalGalleryCount}/{MAX_GALLERY})</span>
            </Label>

            <div className="grid grid-cols-3 gap-4">
              {/* Already-saved images */}
              {existingGalleryUrls.map((url, i) => (
                <div key={`existing-${i}`} className="aspect-square rounded-lg overflow-hidden border border-white/10 relative group/gallery hover:border-amber-500/50 transition-all duration-300">
                  <img src={url} alt={`Saved detail ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050301]/80 to-transparent opacity-0 group-hover/gallery:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))}

              {/* Newly picked images */}
              {newGalleryPreviews.map((src, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] group/new">
                  <img src={src} alt={`New detail ${i + 1}`} className="w-full h-full object-cover opacity-90 group-hover/new:opacity-100 transition-opacity" />
                  <button
                    onClick={() => removeNewGalleryImage(i)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#050301]/90 backdrop-blur-md flex items-center justify-center border border-white/10 hover:border-amber-500 hover:text-amber-400 transition-all"
                    aria-label="Remove image"
                  >
                    <X size={12} className="text-white/80 hover:text-amber-400" />
                  </button>
                </div>
              ))}

              {gallerySlotsLeft > 0 && (
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center text-white/50 hover:border-amber-500 hover:text-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all duration-300"
                >
                  <ImagePlus size={22} />
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

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  type="button" 
                  disabled={isDeleting} 
                  className="w-1/3 bg-transparent border border-red-900/50 text-red-500 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900 transition-all duration-300"
                >
                  {isDeleting ? <Loader2 size={15} className="mr-2 animate-spin" /> : <Trash size={15} className="mr-2" />}
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a1a] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                <DialogHeader>
                  <DialogTitle className="text-amber-400 font-bold">Delete Product</DialogTitle>
                  <DialogDescription className="text-white/60">
                    Are you sure you want to delete this product? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                  <DialogClose asChild>
                    <Button disabled={isDeleting} className="bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button onClick={handleDelete} disabled={isDeleting} className="bg-red-950/80 text-red-400 border border-red-900/50 hover:bg-red-900 hover:text-red-300 transition-colors">
                    {isDeleting ? <Loader2 size={15} className="mr-1.5 animate-spin" /> : <Trash size={15} className="mr-1.5" />}
                    Yes, Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={handleSave} 
              disabled={isUpdating || isUploading || isDeleting} 
              className="w-2/3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold border-0 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:brightness-110 transition-all duration-300 disabled:opacity-50 disabled:grayscale"
            >
              {isUpdating || isUploading ? (
                <><Loader2 size={16} className="mr-2 animate-spin text-black/70" /> Saving...</>
              ) : (
                <><Check size={16} className="mr-2" /> Save Changes</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}