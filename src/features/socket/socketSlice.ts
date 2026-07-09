import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
interface SocketState {
  connected: boolean
  rooms:     string[] // which rooms we've joined, e.g. "kitchen:branchId"
}

const initialState: SocketState = {
  connected: false,
  rooms:     [],
}

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload
      if (!action.payload) state.rooms = [] // reset rooms on disconnect
    },
    roomJoined: (state, action: PayloadAction<string>) => {
      if (!state.rooms.includes(action.payload)) {
        state.rooms.push(action.payload)
      }
    },
  },
})

export const { setConnected, roomJoined } = socketSlice.actions
export default socketSlice.reducer