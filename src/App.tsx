import { AuthProvider } from './contexts/AuthContext'
import { AppRouter } from './routes/AppRouter'

/**
 * App — Root application component.
 * AuthProvider wraps AppRouter so auth context is available
 * to every route, component, and guard in the tree.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
