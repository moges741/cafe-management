import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { useCreateStaffMutation } from '@/features/staff/staffApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

const ROLES = ['manager', 'cashier', 'waiter', 'barista', 'kitchen']

export default function StaffPage() {
  const [createStaff, { isLoading }] = useCreateStaffMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  const handleCreate = async () => {
    if (!email || !password || !role) {
      toast.error('Fill in all fields')
      return
    }
    try {
      await createStaff({ email, password, role, branchId: BRANCH_ID }).unwrap()
      toast.success(`${role} account created`)
      setEmail(''); setPassword(''); setRole('')
    } catch (err: any) {
      toast.error(err?.data?.error?.message ?? 'Could not create staff account')
    }
  }

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-bold text-foreground mb-6">Staff</h1>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <UserPlus size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Create staff account</span>
        </div>

        <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input placeholder="Temporary password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="">Select role</option>
          {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
        </select>

        <Button onClick={handleCreate} disabled={isLoading} className="w-full">
          {isLoading ? 'Creating...' : 'Create account'}
        </Button>
      </div>
    </div>
  )
}