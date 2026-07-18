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

import { createSlice,  } from '@reduxjs/toolkit'
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
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearUser(state) {
      state.user = null
      state.isAuthenticated = false
    },
    setInitializing(state, action: PayloadAction<boolean>) {
      state.isInitializing = action.payload
    },
  },
  extraReducers(builder) {
    // Handle login
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user
        state.isAuthenticated = true
        state.isInitializing = false
      }
    )

    // Handle register
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user
        state.isAuthenticated = true
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
      }
    )

    // Handle getMe error (no active session)
    builder.addMatcher(
      authApi.endpoints.getMe.matchRejected,
      (state) => {
        state.user = null
        state.isAuthenticated = false
        state.isInitializing = false
      }
    )

    // Handle logout
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null
        state.isAuthenticated = false
      }
    )
  },
})

export const { setUser, clearUser, setInitializing } = authSlice.actions
export default authSlice.reducer