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
  signUp: (email: string, password: string) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<AuthResult>
  clearAuthNotice: () => void
}

const NOT_CONFIGURED: AuthResult = { error: 'Auth is not configured' }

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Remove only auth-return params, preserving the hash route and any other query params.
function cleanAuthParamsFromUrl() {
  const url = new URL(window.location.href)
  const authParams = [
    'code',
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

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    let active = true
    let subscription: { unsubscribe: () => void } | null = null

    // Capture verification-return state before cleaning the URL.
    const params = new URL(window.location.href).searchParams
    const returnedError = params.get('error_description') || params.get('error')
    const returnedCode = params.has('code')
    if (returnedError) {
      setAuthError(returnedError)
      cleanAuthParamsFromUrl()
    } else if (returnedCode) {
      // Don't claim success yet — only once a real session exists (below).
      cleanAuthParamsFromUrl()
    }

    getSupabase()
      .then((client) => {
        if (!active || !client) {
          if (active) setLoading(false)
          return
        }

        const sub = client.auth.onAuthStateChange((event, nextSession) => {
          if (!active) return
          setSession(nextSession)
          setUser(nextSession?.user ?? null)
          // Success notice only on a genuine sign-in following a verification code.
          if (event === 'SIGNED_IN' && returnedCode) setJustSignedIn(true)
        })
        subscription = sub.data.subscription

        client.auth
          .getSession()
          .then(({ data, error: sessErr }) => {
            if (!active) return
            if (sessErr) setError(sessErr.message)
            setSession(data.session)
            setUser(data.session?.user ?? null)
            // Covers the race where the code exchange completed before we subscribed.
            if (returnedCode && data.session) setJustSignedIn(true)
          })
          .catch((e: unknown) => {
            if (active) setError(e instanceof Error ? e.message : String(e))
          })
          .finally(() => {
            if (active) setLoading(false)
          })
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

  function clearAuthNotice() {
    setJustSignedIn(false)
    setAuthError(null)
    setError(null)
  }

  const value: AuthContextValue = {
    user,
    session,
    loading,
    error,
    isConfigured: isSupabaseConfigured,
    justSignedIn,
    authError,
    signUp,
    signIn,
    signOut,
    clearAuthNotice,
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
