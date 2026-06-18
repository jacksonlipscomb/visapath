import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

type AuthResult = { error: string | null }

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null // initialization/session error
  isConfigured: boolean
  justSignedIn: boolean // returned from a verification link AND a session was established
  authError: string | null // verification-return or sign-out error
  recoveryActive: boolean // returned via a password-recovery link; show the set-new-password flow
  signUp: (email: string, password: string) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<AuthResult>
  resetPassword: (email: string) => Promise<AuthResult>
  updatePassword: (password: string) => Promise<AuthResult>
  clearAuthNotice: () => void
  clearRecovery: () => void
}

const NOT_CONFIGURED: AuthResult = { error: 'Auth is not configured' }

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Remove only auth-return params, preserving the hash route and any other query params.
function cleanAuthParamsFromUrl() {
  const url = new URL(window.location.href)
  const authParams = [
    'code',
    'recovery',
    'error',
    'error_code',
    'error_description',
    'state',
    'type',
    'access_token',
    'refresh_token',
    'expires_in',
    'expires_at',
    'token_type',
    'provider_token',
    'provider_refresh_token',
  ]
  let changed = false
  for (const p of authParams) {
    if (url.searchParams.has(p)) {
      url.searchParams.delete(p)
      changed = true
    }
  }
  if (!changed) return
  const search = url.searchParams.toString()
  window.history.replaceState({}, '', url.pathname + (search ? `?${search}` : '') + url.hash)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [justSignedIn, setJustSignedIn] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [recoveryActive, setRecoveryActive] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    let active = true
    let subscription: { unsubscribe: () => void } | null = null

    // Capture verification/recovery-return state. Do NOT strip it yet: the
    // lazily-created client must still see `?code=` to exchange it for a session.
    const params = new URL(window.location.href).searchParams
    const returnedError = params.get('error_description') || params.get('error')
    const returnedCode = params.has('code')
    const isRecovery = params.get('recovery') === '1'

    getSupabase()
      .then(async (client) => {
        if (!active || !client) {
          if (active) setLoading(false)
          return
        }

        const sub = client.auth.onAuthStateChange((event, nextSession) => {
          if (!active) return
          setSession(nextSession)
          setUser(nextSession?.user ?? null)
          if (event === 'PASSWORD_RECOVERY') setRecoveryActive(true)
          // Success notice only on a genuine, non-recovery sign-in following a verification code.
          else if (event === 'SIGNED_IN' && returnedCode && !isRecovery) setJustSignedIn(true)
        })
        subscription = sub.data.subscription

        try {
          // getSession() internally awaits the SDK's detectSessionInUrl exchange,
          // so the `?code=` is consumed here BEFORE we strip it from the URL.
          const { data, error: sessErr } = await client.auth.getSession()
          if (!active) return
          if (sessErr) setError(sessErr.message)
          setSession(data.session)
          setUser(data.session?.user ?? null)
          if (returnedError) setAuthError(returnedError)
          else if (isRecovery && data.session) setRecoveryActive(true)
          else if (returnedCode && data.session) setJustSignedIn(true)
          else if (returnedCode && !data.session)
            setAuthError('Your link is invalid or has expired. Please try logging in or request a new link.')
        } catch (e: unknown) {
          if (active) setError(e instanceof Error ? e.message : String(e))
        } finally {
          if (active) {
            // Strip auth params only after the code/error has been processed.
            if (returnedCode || returnedError || isRecovery) cleanAuthParamsFromUrl()
            setLoading(false)
          }
        }
      })
      .catch((e: unknown) => {
        if (active) {
          setError(e instanceof Error ? e.message : String(e))
          setLoading(false)
        }
      })

    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [])

  async function signUp(email: string, password: string): Promise<AuthResult> {
    const client = await getSupabase()
    if (!client) return NOT_CONFIGURED
    const { error: e } = await client.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    })
    return { error: e?.message ?? null }
  }

  async function signIn(email: string, password: string): Promise<AuthResult> {
    const client = await getSupabase()
    if (!client) return NOT_CONFIGURED
    const { error: e } = await client.auth.signInWithPassword({ email, password })
    return { error: e?.message ?? null }
  }

  async function signOut(): Promise<AuthResult> {
    const client = await getSupabase()
    if (!client) return NOT_CONFIGURED
    const { error: e } = await client.auth.signOut()
    if (e) setAuthError(e.message) // surface logout failures in the top-level notice
    return { error: e?.message ?? null }
  }

  async function resetPassword(email: string): Promise<AuthResult> {
    const client = await getSupabase()
    if (!client) return NOT_CONFIGURED
    const { error: e } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/?recovery=1`,
    })
    return { error: e?.message ?? null }
  }

  async function updatePassword(password: string): Promise<AuthResult> {
    const client = await getSupabase()
    if (!client) return NOT_CONFIGURED
    const { error: e } = await client.auth.updateUser({ password })
    if (!e) setRecoveryActive(false)
    return { error: e?.message ?? null }
  }

  function clearAuthNotice() {
    setJustSignedIn(false)
    setAuthError(null)
    setError(null)
  }

  function clearRecovery() {
    setRecoveryActive(false)
  }

  const value: AuthContextValue = {
    user,
    session,
    loading,
    error,
    isConfigured: isSupabaseConfigured,
    justSignedIn,
    authError,
    recoveryActive,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    clearAuthNotice,
    clearRecovery,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
