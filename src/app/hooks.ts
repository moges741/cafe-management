import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Instead of writing useDispatch<AppDispatch>() everywhere,
// you just import and use useAppDispatch() — TypeScript already
// knows the correct type
export const useAppDispatch: () => AppDispatch = useDispatch

// Same idea for selector — useAppSelector already knows RootState's shape
// so state.auth.user autocompletes correctly with no manual typing
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector