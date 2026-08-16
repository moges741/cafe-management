// import { createSlice } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'
// interface User {
//   id:    string
//   email: string
//   role:  { id: string; name: string }
// }

// interface AuthState {
//   user:            User | null
//   isAuthenticated: boolean
//   // NEW — tracks whether we've finished checking session status yet
//   // Prevents flashing the login page before we know the real answer
//   isInitializing:  boolean
// }

// const initialState: AuthState = {
//   user:            null,
//   isAuthenticated: false,
//   isInitializing:  true,   // starts true — we haven't checked yet
// }

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<User>) => {
//       state.user            = action.payload
//       state.isAuthenticated = true
//       state.isInitializing  = false
//     },

//     clearUser: (state) => {
//       state.user            = null
//       state.isAuthenticated = false
//       state.isInitializing  = false
//     },
//   },
// })

// export const { setUser, clearUser } = authSlice.actions
// export default authSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { authApi } from './authApi'

export type UserRole = 'admin' | 'manager' | 'kitchen' | 'cashier' | 'waiter' | 'barista' | 'customer'

export interface User {
  id: string
  email: string
  role: UserRole
  firstName?: string
  lastName?: string
  branchId?: string
  isActive?: boolean
  createdAt?: string
  employee?: { branchId?: string }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
}

const PROFILE_KEY = 'mr_cafe_user_profile'

function loadSavedProfile(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveProfile(user: User | null) {
  if (typeof window === 'undefined') return
  try {
    if (user) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(PROFILE_KEY)
    }
  } catch {}
}

const savedUser = loadSavedProfile()

const initialState: AuthState = {
  user: savedUser,
  isAuthenticated: !!savedUser,
  isInitializing: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.isAuthenticated = true
      saveProfile(action.payload)
    },
    clearUser(state) {
      state.user = null
      state.isAuthenticated = false
      saveProfile(null)
    },
    setInitializing(state, action: PayloadAction<boolean>) {
      state.isInitializing = action.payload
    },
  },
  extraReducers(builder) {
    // Handle login
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }: any) => {
        if (payload?.user) {
          state.user = payload.user
          state.isAuthenticated = true
          saveProfile(payload.user)
        }
        state.isInitializing = false
      }
    )

    // Handle register
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, { payload }: any) => {
        if (payload?.user) {
          state.user = payload.user
          state.isAuthenticated = true
          saveProfile(payload.user)
        }
        state.isInitializing = false
      }
    )

    // Handle getMe (session restoration)
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, { payload }) => {
        state.user = payload
        state.isAuthenticated = true
        state.isInitializing = false
        saveProfile(payload)
      }
    )

    // Handle getMe error (no active session vs network offline)
    builder.addMatcher(
      authApi.endpoints.getMe.matchRejected,
      (state, action: any) => {
        const isNetworkError =
          action.payload?.status === 'FETCH_ERROR' ||
          action.error?.name === 'FetchError' ||
          (typeof navigator !== 'undefined' && !navigator.onLine)

        if (isNetworkError) {
          // Network is offline: preserve existing user profile state if available
          // so PWA application shell can load, but mark initialization complete.
          state.isInitializing = false
        } else {
          // Explicit authentication failure (401, 403, etc.): session invalid/expired.
          state.user = null
          state.isAuthenticated = false
          state.isInitializing = false
          saveProfile(null)
        }
      }
    )

    // Handle logout
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null
        state.isAuthenticated = false
        saveProfile(null)
      }
    )
  },
})

export const { setUser, clearUser, setInitializing } = authSlice.actions
export default authSlice.reducer