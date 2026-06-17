import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

type Props = { mode: 'login' | 'signup' }

export default function AuthForm({ mode }: Props) {
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [signupSent, setSignupSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setSubmitting(true)
    const run = mode === 'login' ? signIn : signUp
    const { error } = await run(email.trim(), password)
    setSubmitting(false)
    if (error) {
      setErrorMsg(error)
      return
    }
    if (mode === 'signup') setSignupSent(true)
    // login success → the page's redirect effect navigates away
  }

  if (signupSent) {
    return (
      <div className="callout-success" role="status">
        <strong>Check your email.</strong> We sent a verification link to{' '}
        <span style={{ fontWeight: 600 }}>{email.trim()}</span>. Confirm it, then log in.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <label className="form-label" htmlFor="auth-email">
          Email
        </label>
        <input
          id="auth-email"
          type="email"
          className="form-input"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="form-label" htmlFor="auth-password">
          Password
        </label>
        <input
          id="auth-password"
          type="password"
          className="form-input"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          {...(mode === 'signup' ? { minLength: 6 } : {})}
        />
        {mode === 'signup' && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
            At least 6 characters.
          </p>
        )}
      </div>

      {errorMsg && (
        <div className="callout-warn" role="alert">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        className="btn-primary"
        disabled={submitting}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
      </button>
    </form>
  )
}
