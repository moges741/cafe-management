import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
interface User {
  id:    string
  email: string
  role:  { id: string; name: string }
}

interface AuthState {
  user:            User | null
  isAuthenticated: boolean
  // NEW — tracks whether we've finished checking session status yet
  // Prevents flashing the login page before we know the real answer
  isInitializing:  boolean
}

const initialState: AuthState = {
  user:            null,
  isAuthenticated: false,
  isInitializing:  true,   // starts true — we haven't checked yet
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user            = action.payload
      state.isAuthenticated = true
      state.isInitializing  = false
    },

    clearUser: (state) => {
      state.user            = null
      state.isAuthenticated = false
      state.isInitializing  = false
    },
  },
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer