import { Toaster } from 'react-hot-toast'
import AppRouter from './router/AppRouter'
import SessionInitializer from './features/auth/SessionInitializer'

function App() {
  return (
    <SessionInitializer>
      <AppRouter />
      <Toaster position="top-center" />
    </SessionInitializer>
  )
}

export default App