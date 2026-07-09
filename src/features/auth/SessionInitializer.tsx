import { useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { useGetMeQuery } from './authApi'
import { setUser, clearUser } from './authSlice'

// Renders nothing visible — its only job is to sync
// "am I logged in?" from the backend into Redux on app start
export default function SessionInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()


  const { data, isLoading, isError } = useGetMeQuery()

  useEffect(() => {
    if (isLoading) return // wait for the request to finish

    if (data) {
      dispatch(setUser(data))
    } else if (isError) {
      dispatch(clearUser())
    }
  }, [data, isLoading, isError, dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground text-sm">Loading Mr. Cafe...</p>
      </div>
    )
  }

  return <>{children}</>
}