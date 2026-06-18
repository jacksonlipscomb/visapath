import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UpdatePassword() {
  const { updatePassword, isConfigured, loading, session } = useAuth()
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setSubmitting(true)
    const { error } = await updatePassword(password)
    setSubmitting(false)
    if (error) {
      setErrorMsg(error)
      return
    }
    setDone(true)
  }

  function body() {
    if (!isConfigured) {
      return (
        <div className="callout-warn" role="status">
          Auth is not configured. Set the Supabase environment variables to enable password reset.
        </div>
      )
    }
    // Wait for auth init before deciding whether a session exists.
    if (loading) return null
    if (done) {
      return (
        <div className="callout-success" role="status" style={{ textAlign: 'center' }}>
          <strong>Password updated.</strong> <Link to="/">Continue</Link>
        </div>
      )
    }
    if (!session) {
      return (
        <div className="callout-warn" role="status">
          Open the reset link from your email to set a new password.
        </div>
      )
    }
    return (
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <label className="form-label" htmlFor="new-password">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            className="form-input"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
            At least 6 characters.
          </p>
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
          {submitting ? 'Please wait…' : 'Update password'}
        </button>
      </form>
    )
  }

  return (
    <main>
      <div
        className="container"
        style={{
          maxWidth: '400px',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'var(--space-8) 16px',
          gap: 'var(--space-5)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: 'var(--space-2)',
              letterSpacing: '-0.01em',
            }}
          >
            Set a new password
          </h1>
        </div>
        {body()}
      </div>
    </main>
  )
}
