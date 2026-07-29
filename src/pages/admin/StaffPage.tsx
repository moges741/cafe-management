"use client";

import { useState, useMemo, useEffect } from 'react'
import {
  UserPlus,
  Trash2,
  Power,
  Calendar,
  Mail,
  Shield,
  Coffee,
  ChefHat,
  Wallet,
  Utensils,
  UserCog,
  X,
  Users,
  Edit2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useGetStaffQuery,
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useToggleStaffStatusMutation,
  useUpdateStaffMutation,
  useStaffUserQuery
} from '@/features/staff/staffApi'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const ROLES = ['manager', 'cashier', 'waiter', 'barista', 'kitchen']

// Premium Role Configurations
const ROLE_CONFIG: Record<string, { icon: any, color: string, bg: string, border: string, shadow: string }> = {
  manager: { icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]' },
  cashier: { icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]' },
  waiter: { icon: Utensils, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]' },
  barista: { icon: Coffee, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' },
  kitchen: { icon: ChefHat, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]' },
  default: { icon: UserCog, color: 'text-neutral-400', bg: 'bg-neutral-500/10', border: 'border-white/10', shadow: 'shadow-none' }
}

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
} as const

export default function StaffPage() {
  const { branchId } = useCurrentBranch()
  
  // Fetch staff
  const { data: staffList = [], isLoading: isLoadingStaff } = useGetStaffQuery({ branchId: branchId || undefined }, { skip: !branchId })

  // Mutations
  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation()
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation()
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation()
  const [toggleStatus] = useToggleStaffStatusMutation()

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<ReturnType<typeof useStaffUserQuery> | null>(null)
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  // Reset form
  useEffect(() => {
    if (!showForm) {
      setEditingStaff(null)
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setRole('')
    }
  }, [showForm])

  // Populate form for editing
  useEffect(() => {
    if (editingStaff) {
      setFirstName(editingStaff.firstName || '')
      setLastName(editingStaff.lastName || '')
      setEmail(editingStaff.email || '')
      setRole(editingStaff.role?.name || '')
      setPassword('')
      setShowForm(true)
    }
  }, [editingStaff])

  // Group staff by roles
  const groupedStaff = useMemo(() => {
    const groups: Record<string, any[]> = {}
    
    // Initialize groups to maintain specific order
    ROLES.forEach(r => { groups[r] = [] })
    groups['other'] = []

    staffList.forEach(staff => {
      const roleName = staff.role?.name?.toLowerCase() || 'other'
      if (groups[roleName]) {
        groups[roleName].push(staff)
      } else {
        groups['other'].push(staff)
      }
    })
    return groups
  }, [staffList])

  const handleSubmit = async () => {
    if (!email || !role || !firstName || !lastName || (!editingStaff && !password)) {
      toast.error('Fill in all required fields')
      return
    }
    if (!branchId) {
      toast.error('No branch selected')
      return
    }

    try {
      if (editingStaff) {
        await updateStaff({
          id: editingStaff.id,
          data: { firstName, lastName, email, role, password: password || undefined, branchId }
        }).unwrap()
        toast.success(`Staff account updated`)
      } else {
        await createStaff({ firstName, lastName, email, password, role, branchId }).unwrap()
        toast.success(`${role} account created`)
      }
      setShowForm(false)
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? `Could not ${editingStaff ? 'update' : 'create'} staff account`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this staff member?')) return
    try {
      await deleteStaff(id).unwrap()
      toast.success('Staff member removed')
    } catch (err: any) {
      toast.error('Could not remove staff member')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStatus(id).unwrap()
      toast.success(currentStatus ? 'Staff deactivated' : 'Staff activated')
    } catch (err: any) {
      toast.error('Could not update staff status')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-[#050301] relative overflow-hidden pb-20">
      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-orange-950/15 rounded-full blur-[150px] mix-blend-screen" />
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
              <Users size={12} /> Team Overview
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Staff Management</h1>
            <p className="text-sm mt-2 text-neutral-400 font-medium">
              Organize roles, monitor status, and manage access for your team.
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl px-6 py-6 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all hover:-translate-y-0.5"
          >
            <UserPlus size={18} />
            {showForm && !editingStaff ? 'Close Panel' : 'Add Staff'}
          </Button>
        </motion.div>

        {/* ================= CREATE / EDIT FORM PANEL ================= */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0, scale: 0.98 }}
              animate={{ height: "auto", opacity: 1, scale: 1 }}
              exit={{ height: 0, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white/[0.02] border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.05)] backdrop-blur-2xl rounded-[32px] p-8 mb-8 relative">
                <button 
                  onClick={() => setShowForm(false)}
                  className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    {editingStaff ? <Edit2 size={18} /> : <UserPlus size={18} />}
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{editingStaff ? 'Edit Account' : 'Create New Account'}</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">First Name</Label>
                    <Input
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-amber-500/50 rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Last Name</Label>
                    <Input
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-amber-500/50 rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Email</Label>
                    <Input
                      placeholder="staff@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-amber-500/50 rounded-xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      {editingStaff ? 'New Password (Optional)' : 'Temporary Password'}
                    </Label>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-amber-500/50 rounded-xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Role</Label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-amber-500/50 outline-none appearance-none"
                    >
                      <option value="" className="bg-neutral-900">Select role</option>
                      {ROLES.map((r) => (
                        <option key={r} value={r} className="capitalize bg-neutral-900">
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isCreating || isUpdating} 
                    className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl h-12 px-8"
                  >
                    {isCreating || isUpdating ? 'Saving...' : (editingStaff ? 'Update Account' : 'Create Account')}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= CATEGORIZED STAFF LIST ================= */}
        {isLoadingStaff ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-1 min-w-[300px] h-64 rounded-[32px] bg-white/5 animate-pulse border border-white/10 backdrop-blur-md" />
            ))}
          </div>
        ) : staffList.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[32px] backdrop-blur-sm"
          >
            <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
              <UserPlus size={32} className="text-neutral-600" />
            </div>
            <p className="text-xl font-bold text-white tracking-tight">No staff members yet</p>
            <p className="text-sm text-neutral-500 mt-2">Click "Add staff" to create and assign roles.</p>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedStaff).map(([roleKey, members]) => {
              if (members.length === 0) return null;
              
              const config = ROLE_CONFIG[roleKey] || ROLE_CONFIG.default
              const RoleIcon = config.icon

              return (
                <motion.div 
                  key={roleKey}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 rounded-xl border", config.bg, config.border, config.shadow)}>
                      <RoleIcon size={20} className={config.color} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white capitalize tracking-tight">{roleKey}s</h3>
                      <p className="text-xs text-neutral-500 font-medium uppercase tracking-widest">{members.length} {members.length === 1 ? 'Member' : 'Members'}</p>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {members.map((staff) => (
                      <motion.div
                        variants={itemVariants}
                        key={staff.id}
                        className={cn(
                          "bg-white/[0.02] backdrop-blur-xl border rounded-[24px] p-6 relative overflow-hidden group flex flex-col transition-all duration-300",
                          staff.isActive ? "border-white/10 hover:border-white/30 hover:bg-white/[0.04]" : "border-red-500/10 opacity-75 grayscale hover:grayscale-0 bg-black/20"
                        )}
                      >
                        {/* Hover Glow inside card */}
                        <div className={cn(
                          "absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                          staff.isActive ? config.bg : "bg-red-500/10"
                        )} />

                        {/* Card Header (Avatar + Status) */}
                        <div className="flex justify-between items-start mb-5 relative z-10">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black border",
                            staff.isActive ? "bg-white/5 border-white/10 text-white" : "bg-red-500/10 border-red-500/20 text-red-400"
                          )}>
                            {staff.firstName?.charAt(0) || staff.email.charAt(0).toUpperCase()}
                          </div>
                          
                          <div className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border",
                            staff.isActive 
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                              : "bg-red-500/10 border-red-500/20 text-red-400"
                          )}>
                            {staff.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>

                        {/* Info Section */}
                        <div className="space-y-1 relative z-10 mb-6">
                          <h4 className="text-lg font-bold text-white truncate">
                            {staff.firstName ? `${staff.firstName} ${staff.lastName}` : 'Unnamed Staff'}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-neutral-400">
                            <Mail size={14} className="shrink-0 text-neutral-500" />
                            <span className="truncate">{staff.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 pt-2">
                            <Calendar size={13} className="shrink-0" />
                            Joined {formatDate(staff.createdAt)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-2 relative z-10">
                          <button
                            onClick={() => handleToggleStatus(staff.id, staff.isActive)}
                            className={cn(
                              "flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all border",
                              staff.isActive
                                ? "bg-red-500/5 text-red-400 border-red-500/10 hover:bg-red-500/20"
                                : "bg-emerald-500/5 text-emerald-400 border-emerald-500/10 hover:bg-emerald-500/20"
                            )}
                            title={staff.isActive ? 'Revoke Access' : 'Activate'}
                          >
                            <Power size={16} />
                          </button>

                          <button
                            onClick={() => setEditingStaff(staff)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 text-neutral-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all text-xs font-bold"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          
                          <button
                            onClick={() => handleDelete(staff.id)}
                            disabled={isDeleting}
                            className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-neutral-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all disabled:opacity-50"
                            title="Delete Staff Member"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}