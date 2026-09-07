import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

// =====================================================
// AUTH CONTEXT — Dor Indian Artisan Marketplace
//
// Provides:
//   user        — Supabase auth.User (JWT identity)
//   profile     — Row from `profiles` table (role, name…)
//   session     — Active Supabase session
//   authLoading — True until the first getSession() resolves
//   signIn()    — Email + password login via Supabase
//   signUp()    — Registration: auth user + profile row insert
//   signOut()   — Ends session and clears state
// =====================================================

// ── Friendly error mapper ──────────────────────────
function mapAuthError(message: string): string {
  const msg = message.toLowerCase()
  if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) {
    return 'Email or password is incorrect.'
  }
  if (msg.includes('email not confirmed')) {
    return 'Please confirm your email before signing in.'
  }
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'An account with this email already exists.'
  }
  if (msg.includes('password should be at least')) {
    return 'Password must be at least 6 characters.'
  }
  if (msg.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  return 'Something went wrong. Please try again.'
}

// ── Context shape ──────────────────────────────────
interface AuthContextValue {
  user: User | null
  profile: Profile | null
  session: Session | null
  authLoading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: Profile['role']
  ) => Promise<string | null>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Internal: fetch profile row ────────────────────
async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // Not finding a profile row is non-fatal (e.g. right after signup before insert)
      console.warn('[AuthContext] fetchProfile:', error.message)
      return null
    }
    return data as Profile
  } catch {
    return null
  }
}

// ── Provider ───────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Sync profile whenever the user changes
  const syncProfile = useCallback(async (u: User | null) => {
    if (!u) {
      setProfile(null)
      return
    }
    const p = await fetchProfile(u.id)
    setProfile(p)
  }, [])

  // Expose profile refresh for post-update cases
  const refreshProfile = useCallback(async () => {
    await syncProfile(user)
  }, [user, syncProfile])

  // ── Bootstrap: load existing session on mount ──
  useEffect(() => {
    let mounted = true

    async function bootstrap() {
      const { data: { session: existingSession } } = await supabase.auth.getSession()

      if (!mounted) return

      setSession(existingSession)
      setUser(existingSession?.user ?? null)

      // Fetch profile in parallel with auth resolution
      if (existingSession?.user) {
        await syncProfile(existingSession.user)
      }

      setAuthLoading(false)
    }

    bootstrap()

    // ── Real-time auth state changes ──
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return

        setSession(newSession)
        setUser(newSession?.user ?? null)
        await syncProfile(newSession?.user ?? null)

        // Only clear the loading state if it was still true
        setAuthLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [syncProfile])

  // ── signIn ─────────────────────────────────────
  const signIn = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return mapAuthError(error.message)
      }
      // onAuthStateChange will update user/session/profile automatically
      return null
    },
    []
  )

  // ── signUp ─────────────────────────────────────
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      role: Profile['role']
    ): Promise<string | null> => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
        },
      })

      if (error) {
        return mapAuthError(error.message)
      }

      // Insert profile row if the user was created immediately
      // (Supabase may require email confirmation before user.id is available)
      if (data.user) {
        const now = new Date().toISOString()
        const { error: profileError } = await supabase.from('profiles').upsert(
          {
            id:         data.user.id,
            full_name:  fullName,
            role,
            avatar_path: null,
            phone: null,
            preferred_language: 'en',
            is_active: true,
            created_at: now,
            updated_at: now,
          },
          { onConflict: 'id' }
        )

        if (profileError) {
          // Non-fatal: auth account was created. Profile may be set by a DB trigger.
          console.warn('[AuthContext] Profile insert failed:', profileError.message)
        }
      }

      return null
    },
    []
  )

  // ── signOut ────────────────────────────────────
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }, [])

  const value: AuthContextValue = {
    user,
    profile,
    session,
    authLoading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ── Internal hook (used by useAuth.ts) ────────────
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
