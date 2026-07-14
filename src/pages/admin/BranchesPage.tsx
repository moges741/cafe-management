import { useState } from 'react'
import { Plus, Search, Store, MapPin, Globe, Trash2, Edit } from 'lucide-react'
import { 
  useGetBranchesQuery, 
  useCreateBranchMutation, 
  useUpdateBranchMutation,
  useDeactivateBranchMutation 
} from '@/features/branches/branchesApi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function BranchesPage() {
  const { data: branches = [], isLoading } = useGetBranchesQuery()
  const [createBranch] = useCreateBranchMutation()
  const [updateBranch] = useUpdateBranchMutation()
  const [deactivateBranch] = useDeactivateBranchMutation()

  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({ name: '', address: '', timezone: 'Africa/Addis_Ababa' })
  const [editingId, setEditingId] = useState<string | null>(null)

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({ name: '', address: '', timezone: 'Africa/Addis_Ababa' })
    setIsCreateOpen(true)
  }

  const handleOpenEdit = (branch: any) => {
    setEditingId(branch.id)
    setFormData({ 
      name: branch.name, 
      address: branch.address || '', 
      timezone: branch.timezone 
    })
    setIsCreateOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateBranch({ id: editingId, ...formData }).unwrap()
        toast.success('Branch updated successfully')
      } else {
        await createBranch(formData).unwrap()
        toast.success('Branch created successfully')
      }
      setIsCreateOpen(false)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Action failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to deactivate this branch?')) {
      try {
        await deactivateBranch(id).unwrap()
        toast.success('Branch deactivated')
      } catch (err: any) {
        toast.error('Failed to deactivate branch')
      }
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Branches</h1>
          <p className="text-sm mt-1" style={{ color: '#B58B67' }}>
            Manage your cafe locations and operation hubs.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-5 py-5 shadow-sm">
              <Plus size={18} /> Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'Update the details for this location.' : 'Create a new physical or logical branch.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Branch Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="e.g. Bole Branch" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={e => setFormData({ ...formData, address: e.target.value })} 
                  placeholder="e.g. Bole Road, Addis Ababa" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input 
                  id="timezone" 
                  value={formData.timezone} 
                  onChange={e => setFormData({ ...formData, timezone: e.target.value })} 
                  placeholder="e.g. Africa/Addis_Ababa" 
                  required 
                />
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit">{editingId ? 'Save Changes' : 'Create Branch'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-3xl bg-card animate-pulse border border-border" />
          ))
        ) : filteredBranches.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-card rounded-3xl border border-border shadow-sm">
            <Store className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-foreground">No branches found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or add a new branch.</p>
          </div>
        ) : (
          filteredBranches.map((branch) => (
            <div key={branch.id} className={cn(
              "rounded-3xl border bg-card p-6 shadow-sm transition-all hover:shadow-md relative overflow-hidden group flex flex-col",
              branch.isActive ? "border-border hover:border-primary/40" : "border-destructive/30 opacity-75 grayscale-[50%]"
            )}>
              <div className={cn(
                "absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-[0.03] transition-transform group-hover:scale-110 duration-500",
                branch.isActive ? "bg-primary" : "bg-destructive"
              )} />
              
              <div className="flex justify-between items-start mb-4 relative">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center border",
                    branch.isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"
                  )}>
                    <Store size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{branch.name}</h3>
                    <Badge variant="outline" className={cn(
                      "mt-1 text-[10px] uppercase px-1.5 py-0",
                      branch.isActive ? "border-emerald-500/20 text-emerald-600 bg-emerald-500/10" : "border-destructive/20 text-destructive bg-destructive/10"
                    )}>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 relative mb-6">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>{branch.address || 'No address provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe size={16} className="shrink-0" />
                  <span>{branch.timezone}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-border flex items-center justify-end gap-2 relative">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOpenEdit(branch)}
                  className="rounded-lg text-xs"
                >
                  <Edit size={14} className="mr-1.5" /> Edit
                </Button>
                {branch.isActive && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(branch.id)}
                    className="rounded-lg text-xs border-destructive/20 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={14} className="mr-1.5" /> Deactivate
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
