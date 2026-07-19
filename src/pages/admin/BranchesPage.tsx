"use client";

import { useState } from 'react'
import { Plus, Search, Store, MapPin, Globe, Trash2, Edit, Sparkles, Building2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function BranchesPage() {
  const { data: branches = [], isLoading } = useGetBranchesQuery()
  const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation()
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation()
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

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to deactivate ${name}?`)) {
      try {
        await deactivateBranch(id).unwrap()
        toast.success('Branch deactivated')
      } catch (err: any) {
        toast.error('Failed to deactivate branch')
      }
    }
  }

  const isSubmitting = isCreating || isUpdating

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
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <Building2 size={12} /> Infrastructure
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Branches Overview</h1>
            <p className="text-sm mt-2 text-neutral-400 font-medium">
              Manage your cafe locations, operation hubs, and timezones.
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleOpenCreate} 
                className="gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl px-6 py-6 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all hover:-translate-y-0.5"
              >
                <Plus size={18} /> Add Branch
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a]/95 backdrop-blur-2xl border-white/10 text-white rounded-[24px] shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <Store className="text-amber-500" size={20} />
                  {editingId ? 'Edit Branch' : 'Add New Branch'}
                </DialogTitle>
                <DialogDescription className="text-neutral-400">
                  {editingId ? 'Update the details for this location.' : 'Create a new physical or logical branch.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Branch Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="e.g. Bole Branch" 
                    required 
                    className="bg-black/50 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-amber-500/50 rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Address</Label>
                  <Input 
                    id="address" 
                    value={formData.address} 
                    onChange={e => setFormData({ ...formData, address: e.target.value })} 
                    placeholder="e.g. Bole Road, Addis Ababa" 
                    className="bg-black/50 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-amber-500/50 rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Timezone</Label>
                  <Input 
                    id="timezone" 
                    value={formData.timezone} 
                    onChange={e => setFormData({ ...formData, timezone: e.target.value })} 
                    placeholder="e.g. Africa/Addis_Ababa" 
                    required 
                    className="bg-black/50 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-amber-500/50 rounded-xl h-12"
                  />
                </div>
                <DialogFooter className="mt-8 gap-3 sm:gap-0">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="bg-transparent border-white/10 text-white hover:bg-white/5 rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl">
                    {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Branch'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* ================= CONTROLS & SEARCH ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 items-center bg-white/[0.02] backdrop-blur-2xl p-4 rounded-[24px] border border-white/10 shadow-xl"
        >
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input
              type="text"
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all shadow-inner"
            />
          </div>
          
          <div className="ml-auto px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-semibold text-white">{branches.length} Total Branches</span>
          </div>
        </motion.div>

        {/* ================= GRID ================= */}
        <motion.div layout className="min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div 
                key="loading"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div 
                    variants={itemVariants}
                    key={`skeleton-${i}`} 
                    className="h-56 rounded-[24px] bg-white/5 backdrop-blur-md animate-pulse border border-white/10" 
                  />
                ))}
              </motion.div>
            ) : filteredBranches.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="col-span-full text-center py-20 bg-white/[0.02] rounded-[32px] border border-dashed border-white/10 backdrop-blur-sm"
              >
                <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Store size={32} className="text-neutral-600" />
                </div>
                <p className="text-xl font-bold text-white tracking-tight">No branches found</p>
                <p className="text-sm text-neutral-500 mt-2">Try adjusting your search or add a new branch.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredBranches.map((branch) => (
                  <motion.div 
                    variants={itemVariants}
                    layout
                    key={branch.id} 
                    className={cn(
                      "rounded-[24px] bg-white/[0.02] backdrop-blur-xl p-6 transition-all duration-300 relative overflow-hidden group flex flex-col border",
                      branch.isActive 
                        ? "border-white/10 hover:border-amber-500/30 hover:bg-white/[0.04]" 
                        : "border-red-500/10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 bg-black/20"
                    )}
                  >
                    {/* Ambient Hover Glow inside card */}
                    <div className={cn(
                      "absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[50px] transition-opacity duration-500 pointer-events-none",
                      branch.isActive ? "bg-amber-500/10 opacity-0 group-hover:opacity-100" : "bg-red-500/10 opacity-50"
                    )} />
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0",
                          branch.isActive 
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                          <Store size={22} />
                        </div>
                        <div className="pt-1">
                          <h3 className="text-lg font-bold text-white leading-none mb-2">{branch.name}</h3>
                          <Badge variant="outline" className={cn(
                            "text-[10px] uppercase tracking-widest px-2 py-0.5 font-bold shadow-sm",
                            branch.isActive 
                              ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10" 
                              : "border-red-500/20 text-red-400 bg-red-500/10"
                          )}>
                            {branch.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10 mb-8 bg-black/20 p-4 rounded-xl border border-white/5">
                      <div className="flex items-start gap-3 text-sm text-neutral-300">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-neutral-500" />
                        <span className="font-medium">{branch.address || 'No address provided'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-neutral-300">
                        <Globe size={16} className="shrink-0 text-neutral-500" />
                        <span className="font-medium">{branch.timezone}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-end gap-3 relative z-10">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenEdit(branch)}
                        className="rounded-xl text-xs bg-white/5 border-white/10 text-white hover:bg-white/10"
                      >
                        <Edit size={14} className="mr-2 text-amber-400" /> Edit Details
                      </Button>
                      {branch.isActive && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(branch.id, branch.name)}
                          className="rounded-xl text-xs border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/20 hover:text-red-300"
                        >
                          <Trash2 size={14} className="mr-2" /> Deactivate
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}