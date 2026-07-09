
  import { useLogoutMutation } from '@/features/auth/authApi'
import { useAppDispatch } from '@/app/hooks'
import { clearUser } from '@/features/auth/authSlice'
import { useNavigate } from 'react-router-dom'



export default function CashierPosPage() {

const [logout] = useLogoutMutation()
const dispatch = useAppDispatch()
const navigate = useNavigate()
const handleLogout = async () => {
  await logout()
  dispatch(clearUser())
  navigate('/login')
}
  return <div className="min-h-screen bg-background text-foreground p-8">Cashier POS Page
  
  
<button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
  Logout
</button>



  
  
  </div>
}   