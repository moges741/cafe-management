import { useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { useGetMeQuery } from './authApi'
import { setUser, clearUser } from './authSlice'
import { socketActions } from '@/features/socket/socketMiddleware'

export default function SessionInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { data, isLoading, isError } = useGetMeQuery()

  useEffect(() => {
    if (isLoading) return

    if (data) {
      dispatch(setUser(data))
    } else if (isError) {
      dispatch(clearUser())
    }

    // Connect the socket regardless of guest/logged-in —
    // guests can still track an order they just placed
    dispatch(socketActions.connect())
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