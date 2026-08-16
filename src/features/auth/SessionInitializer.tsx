import { useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { useGetMeQuery } from './authApi'
import { setUser, clearUser } from './authSlice'
import { socketActions } from '@/features/socket/socketMiddleware'
import { useLazyGetCartQuery } from '@/features/cart/cartApi'

export default function SessionInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { data, isLoading, isError, error } = useGetMeQuery(undefined, { refetchOnReconnect: true })
  const [getCart] = useLazyGetCartQuery()

  useEffect(() => {
    if (isLoading) return

    if (data) {
      dispatch(setUser(data))
      getCart() // Load user's backend cart on init
    } else if (isError) {
      const isAuthFailure = (error as any)?.status === 401 || (error as any)?.status === 403
      if (isAuthFailure) {
        dispatch(clearUser())
      }
    }

    // Connect the socket regardless of guest/logged-in —
    // guests can still track an order they just placed
    dispatch(socketActions.connect())
  }, [data, isLoading, isError, error, dispatch, getCart])

  return <>{children}</>
}