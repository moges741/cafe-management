import { Toaster } from 'react-hot-toast'
import AppRouter from './router/AppRouter'
import SessionInitializer from './features/auth/SessionInitializer'
import AiAssistantWidget from './features/ai/AiAssistantWidget'

function App() {
  return (
    <SessionInitializer>
      <AppRouter />
      <AiAssistantWidget />
      <Toaster position="top-center" />
    </SessionInitializer>
  )
}

export default App