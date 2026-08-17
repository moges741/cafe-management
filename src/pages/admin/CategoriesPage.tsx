"use client";

import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, ImagePlus, Trash2, PencilLine, RefreshCw, Tag, Sparkles, Layers, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useUploadCategoryImageMutation,
} from '@/features/categories/categoriesApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'

import { usePwaCategories } from '@/hooks/usePwaCategories'
import { WifiOff } from 'lucide-react'

type CategoryFormState = {
  name: string
  description: string
}

// Framer Motion Variants
const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function CategoriesPage() {
  const { branchId } = useCurrentBranch()
  const { categories, isLoading, isOnline } = usePwaCategories(
    { includeInactive: true, branchId: branchId || undefined },
    { skip: !branchId }
  )
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()
  const [uploadCategoryImage, { isLoading: isUploading }] = useUploadCategoryImageMutation()

  const [createForm, setCreateForm] = useState<CategoryFormState>({ name: '', description: '' })
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<CategoryFormState>({ name: '', description: '' })
  const imageInputRef = useRef<HTMLInputElement>(null)

  const selectedCategory = useMemo(
    () => categories.find(category => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  )

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(categories[0].id)
    }
  }, [categories, selectedCategoryId])

  useEffect(() => {
    if (selectedCategory) {
      setEditForm({
        name: selectedCategory.name,
        description: selectedCategory.description ?? '',
      })
    }
  }, [selectedCategory])

  const handleCreateCategory = async () => {
    if (!navigator.onLine) {
      toast.error('Network offline: Internet connection is required to create categories.', {
        icon: '📡',
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
      })
      return
    }

    if (!createForm.name.trim()) {
      toast.error('Category name is required')
      return
    }
    if (!branchId) {
      toast.error('No branch selected')
      return
    }

    try {
      const created = await createCategory({
        name: createForm.name.trim(),
        description: createForm.description.trim() || undefined,
        branchId,
      }).unwrap()

      setCreateForm({ name: '', description: '' })
      setSelectedCategoryId(created.id)
      toast.success('Category created')
    } catch (err: any) {
      if (err?.status === 'FETCH_ERROR' || !navigator.onLine) {
        toast.error('Network offline: Internet connection is required to create categories.')
      } else {
        toast.error(err?.data?.message?.[0] ?? err?.data?.error?.message ?? 'Could not create category')
      }
    }
  }

  const handleUpdateCategory = async () => {
    if (!navigator.onLine) {
      toast.error('Network offline: Internet connection is required to update categories.', {
        icon: '📡',
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
      })
      return
    }

    if (!selectedCategory) return
    if (!editForm.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      await updateCategory({
        id: selectedCategory.id,
        data: {
          name: editForm.name.trim(),
          description: editForm.description.trim() || undefined,
        },
      }).unwrap()

      toast.success('Category updated')
    } catch (err: any) {
      if (err?.status === 'FETCH_ERROR' || !navigator.onLine) {
        toast.error('Network offline: Internet connection is required to update categories.')
      } else {
        toast.error(err?.data?.message?.[0] ?? err?.data?.error?.message ?? 'Could not update category')
      }
    }
  }

  const handleImageUpload = async (file?: File) => {
    if (!navigator.onLine) {
      toast.error('Network offline: Internet connection is required to upload category images.', {
        icon: '📡',
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
      })
      return
    }

    if (!selectedCategory || !file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      await uploadCategoryImage({ id: selectedCategory.id, formData }).unwrap()
      toast.success('Category image updated')
    } catch (err: any) {
      toast.error(err?.data?.message?.[0] ?? err?.data?.error?.message ?? 'Could not upload image')
    } finally {
      if (imageInputRef.current) {
        imageInputRef.current.value = ''
      }
    }
  }

  const handleDeleteCategory = async () => {
    if (!navigator.onLine) {
      toast.error('Network offline: Internet connection is required to deactivate categories.', {
        icon: '📡',
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.4)' }
      })
      return
    }

    if (!selectedCategory) return

    const confirmed = window.confirm(`Deactivate category "${selectedCategory.name}"?`)
    if (!confirmed) return

    try {
      await deleteCategory(selectedCategory.id).unwrap()
      toast.success('Category deactivated')

      const nextCategory = categories.find(category => category.id !== selectedCategory.id) ?? null
      setSelectedCategoryId(nextCategory?.id ?? null)
    } catch (err: any) {
      toast.error(err?.data?.message?.[0] ?? err?.data?.error?.message ?? 'Could not deactivate category')
    }
  }

  return (
    <div className="min-h-screen bg-[#050301] relative overflow-hidden pb-20">
      {/* --- Ambient Background Glows --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-orange-950/15 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-8 relative z-10 pt-10">
        
        {/* ================= HEADER ================= */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <Layers size={12} /> Admin
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Categories Dashboard</h1>
            <p className="text-sm mt-2 text-neutral-400 font-medium">
              Create, rename, update images, and manage visibility.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-white font-semibold flex items-center gap-2 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {categories.length} Total Categories
          </div>
        </motion.div>

        {!isOnline && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs md:text-sm flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(245,158,11,0.1)] mb-8">
            <div className="flex items-center gap-3">
              <WifiOff size={18} className="shrink-0 text-amber-400 animate-pulse" />
              <div>
                <span className="font-bold">Offline Mode (Cached Categories):</span> Internet connection is required to create, update, or deactivate categories. Reconnect to sync changes with the server.
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] items-start">
          
          {/* ================= LEFT COL: CREATE CATEGORY ================= */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl relative overflow-hidden group sticky top-6"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Plus size={100} className="text-amber-500" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Plus size={18} />
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">New Category</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Name</Label>
                  <Input
                    value={createForm.name}
                    onChange={e => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Signature Pastries"
                    className="bg-black/30 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-amber-500/50 rounded-xl h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Description</Label>
                  <textarea
                    value={createForm.description}
                    onChange={e => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief details about this category..."
                    className="min-h-28 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-neutral-600 outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 resize-none transition-all"
                  />
                </div>

                <Button 
                  onClick={handleCreateCategory} 
                  disabled={isCreating} 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl h-12 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all"
                >
                  {isCreating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {isCreating ? 'Creating...' : 'Create Category'}
                </Button>
              </div>
            </div>
          </motion.section>

          {/* ================= RIGHT COL: MANAGE & LIST ================= */}
          <section className="space-y-8">
            
            {/* --- Manage Selected Category --- */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <PencilLine size={18} className="text-amber-500" /> Manage Category
                  </h2>
                  <p className="text-sm text-neutral-400 mt-1">
                    Update details, manage imagery, or modify status.
                  </p>
                </div>
                {selectedCategory && (
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                    selectedCategory.isActive 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  )}>
                    {selectedCategory.isActive ? 'Active' : 'Inactive'}
                  </div>
                )}
              </div>

              {!selectedCategory ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center flex flex-col items-center justify-center">
                  <Tag size={32} className="text-neutral-600 mb-3" />
                  <p className="text-sm text-neutral-400 font-medium">Pick a category from the list to manage it.</p>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-[1fr_280px]">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Name</Label>
                      <Input 
                        value={editForm.name} 
                        onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))} 
                        className="bg-black/30 border-white/10 text-white focus-visible:ring-amber-500/50 rounded-xl h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Description</Label>
                      <textarea
                        value={editForm.description}
                        onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-32 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 resize-none transition-all"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button 
                        onClick={handleUpdateCategory} 
                        disabled={isUpdating}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl"
                      >
                        {isUpdating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4 text-emerald-400" />}
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => imageInputRef.current?.click()} 
                        disabled={isUploading}
                        className="bg-transparent hover:bg-white/5 text-white border-white/10 rounded-xl"
                      >
                        {isUploading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4 text-amber-400" />}
                        Upload Image
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteCategory} 
                        disabled={isDeleting}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl ml-auto"
                      >
                        {isDeleting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        {selectedCategory.isActive ? 'Deactivate' : 'Archive'}
                      </Button>
                    </div>

                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files?.[0])}
                    />
                  </div>

                  {/* Image Preview Panel */}
                  <div className="rounded-[24px] border border-white/5 bg-black/20 p-4 space-y-4 shadow-inner flex flex-col">
                    <div className="relative aspect-square w-full rounded-[16px] border border-white/10 overflow-hidden bg-black/40 flex items-center justify-center group">
                      {selectedCategory.imageUrl ? (
                        <>
                          <img src={selectedCategory.imageUrl} alt={selectedCategory.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-neutral-600">
                          <ImagePlus size={32} />
                          <span className="text-xs font-semibold uppercase tracking-wider">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5 px-1 pb-1">
                      <p className="text-sm font-bold text-white truncate">{selectedCategory.name}</p>
                      <p className="text-xs text-neutral-400 line-clamp-2">
                        {selectedCategory.description || 'No description provided'}
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-xs text-amber-500 font-semibold">
                        <Tag size={12} />
                        {selectedCategory._count?.products ?? 0} linked products
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* --- Category Grid --- */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4 md:grid-cols-2"
            >
              {isLoading && Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[120px] rounded-[24px] bg-white/5 border border-white/10 animate-pulse backdrop-blur-md" />
              ))}

              {!isLoading && categories.map(category => {
                const isSelected = category.id === selectedCategoryId
                const isInactive = !category.isActive

                return (
                  <motion.button
                    variants={itemVariants}
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={cn(
                      'relative text-left rounded-[24px] border p-4 transition-all duration-300 backdrop-blur-xl group overflow-hidden flex flex-col',
                      isSelected 
                        ? 'border-amber-500/50 bg-amber-500/5 shadow-[0_0_30px_rgba(245,158,11,0.1)]' 
                        : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]',
                      isInactive && !isSelected && 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                    )}
                  >
                    {/* Selected Glow Indicator */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 blur-[30px] rounded-full pointer-events-none" />
                    )}

                    <div className="flex items-start gap-4 z-10 relative">
                      <div className="w-16 h-16 rounded-[16px] overflow-hidden bg-black/40 shrink-0 border border-white/10 flex items-center justify-center">
                        {category.imageUrl ? (
                          <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                        ) : (
                          <Tag size={20} className="text-neutral-600" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 py-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className={cn("font-bold truncate text-base", isSelected ? "text-amber-400" : "text-white")}>
                            {category.name}
                          </p>
                          {isInactive && (
                            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.8)]" title="Inactive" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 line-clamp-1 mb-2">
                          {category.description || 'No description'}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
                          {category._count?.products ?? 0} Products
                        </p>
                      </div>
                    </div>

                    {isInactive && (
                      <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-red-400/80 flex items-center gap-1.5 uppercase font-bold tracking-wider">
                        <RefreshCw size={10} />
                        Inactive (Available for editing)
                      </div>
                    )}
                  </motion.button>
                )
              })}

              {!isLoading && categories.length === 0 && (
                <div className="col-span-full rounded-[24px] border border-dashed border-white/10 bg-white/5 p-12 text-center flex flex-col items-center">
                  <Layers size={40} className="text-neutral-600 mb-4" />
                  <p className="text-base text-neutral-300 font-bold">No categories found</p>
                  <p className="text-sm text-neutral-500 mt-1">Create the first one using the form on the left.</p>
                </div>
              )}
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  )
}