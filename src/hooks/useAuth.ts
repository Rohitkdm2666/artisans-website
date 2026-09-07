// =====================================================
// useAuth — convenience hook
// Thin wrapper so consumers don't import from contexts/.
// =====================================================

import { useAuthContext } from '@/contexts/AuthContext'

export const useAuth = useAuthContext
