import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, ImagePlus, Trash2, Check, PencilLine, RefreshCw, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useUploadCategoryImageMutation,
} from '@/features/categories/categoriesApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

type CategoryFormState = {
  name: string
  description: string
}

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery({ includeInactive: true })
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
    if (!createForm.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      const created = await createCategory({
        name: createForm.name.trim(),
        description: createForm.description.trim() || undefined,
      }).unwrap()

      setCreateForm({ name: '', description: '' })
      setSelectedCategoryId(created.id)
      toast.success('Category created')
    } catch (err: any) {
      toast.error(err?.data?.message?.[0] ?? err?.data?.error?.message ?? 'Could not create category')
    }
  }

  const handleUpdateCategory = async () => {
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
      toast.error(err?.data?.message?.[0] ?? err?.data?.error?.message ?? 'Could not update category')
    }
  }

  const handleImageUpload = async (file?: File) => {
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
    <div className="p-6 max-w-7xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Admin</p>
          <h1 className="text-2xl font-bold text-foreground">Categories dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#B58B67' }}>
            Create, rename, update images, and deactivate categories from one place.
          </p>
        </div>
        <Badge variant="outline" className="h-7 px-3">
          {categories.length} categories
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="bg-card border border-border rounded-2xl p-5 space-y-4 h-fit">
          <div className="flex items-center gap-2">
            <Plus size={16} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">Create category</h2>
          </div>

          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={createForm.name}
              onChange={e => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Breakfast"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <textarea
              value={createForm.description}
              onChange={e => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Morning items, pastries, coffee"
              className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>

          <Button onClick={handleCreateCategory} disabled={isCreating} className="w-full">
            {isCreating ? 'Creating...' : 'Create category'}
          </Button>
        </section>

        <section className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Manage category</h2>
                <p className="text-sm" style={{ color: '#B58B67' }}>
                  Select a category below to edit details or upload a new image.
                </p>
              </div>
              {selectedCategory && (
                <Badge variant={selectedCategory.isActive ? 'secondary' : 'destructive'}>
                  {selectedCategory.isActive ? 'Active' : 'Inactive'}
                </Badge>
              )}
            </div>

            {!selectedCategory ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm" style={{ color: '#B58B67' }}>
                Pick a category from the list to manage it.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-[1fr_280px]">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Name</Label>
                    <Input value={editForm.name} onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))} />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <textarea
                      value={editForm.description}
                      onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleUpdateCategory} disabled={isUpdating}>
                      <PencilLine size={15} className="mr-1.5" />
                      {isUpdating ? 'Saving...' : 'Save changes'}
                    </Button>
                    <Button variant="outline" onClick={() => imageInputRef.current?.click()} disabled={isUploading}>
                      <ImagePlus size={15} className="mr-1.5" />
                      {isUploading ? 'Uploading...' : 'Upload image'}
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteCategory} disabled={isDeleting}>
                      <Trash2 size={15} className="mr-1.5" />
                      {isDeleting ? 'Deactivating...' : 'Deactivate'}
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

                <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                  <div className="aspect-square rounded-lg border border-border overflow-hidden bg-secondary flex items-center justify-center">
                    {selectedCategory.imageUrl ? (
                      <img src={selectedCategory.imageUrl} alt={selectedCategory.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Tag size={26} />
                        <span className="text-xs">No image yet</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{selectedCategory.name}</p>
                    <p className="text-xs" style={{ color: '#B58B67' }}>
                      {selectedCategory.description || 'No description provided'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedCategory._count?.products ?? 0} linked products
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {isLoading && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-card animate-pulse" />
            ))}

            {!isLoading && categories.map(category => {
              const isSelected = category.id === selectedCategoryId
              const isInactive = !category.isActive

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={[
                    'text-left rounded-2xl border p-4 transition-colors bg-card',
                    isSelected ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/40',
                  ].join(' ')}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border">
                      {category.imageUrl ? (
                        <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/35">
                          <Tag size={18} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-foreground truncate">{category.name}</p>
                        <Badge variant={category.isActive ? 'secondary' : 'destructive'}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: '#B58B67' }}>
                        {category.description || 'No description'}
                      </p>
                      <p className="text-xs mt-2 text-muted-foreground">
                        {category._count?.products ?? 0} products
                      </p>
                    </div>
                  </div>

                  {isInactive && (
                    <div className="mt-3 text-[11px] text-destructive flex items-center gap-1.5">
                      <RefreshCw size={12} />
                      Inactive categories stay available for editing here.
                    </div>
                  )}
                </button>
              )
            })}

            {!isLoading && categories.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-border p-8 text-center text-sm" style={{ color: '#B58B67' }}>
                No categories found. Create the first one using the form on the left.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}