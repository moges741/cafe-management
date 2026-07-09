import { io, Socket } from 'socket.io-client'

// A single shared socket instance for the entire app —
// created once, reused everywhere. We don't want a new
// connection every time a component mounts.
let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(`${import.meta.env.VITE_SOCKET_URL}/events`, {
      // withCredentials sends cookies with the socket handshake —
      // matches your backend's cors: { credentials: true } config
      withCredentials: true,
      autoConnect: false, // we control exactly when to connect via middleware
    })
  }
  return socket
}