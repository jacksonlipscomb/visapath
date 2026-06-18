import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ForgotPassword() {
  const { resetPassword, isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setSubmitting(true)
    const { error } = await resetPassword(email.trim())
    setSubmitting(false)
    // Supabase returns no error for unknown emails (anti-enumeration). An actual
    // error here is operational (rate limit / network / config) — show a generic,
    // non-enumerating message; otherwise show the same neutral confirmation.
    if (error) {
      setErrorMsg("We couldn't send a reset link right now. Please try again later.")
      return
    }
    setSent(true)
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
            Reset your password
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            We'll email you a link to set a new password.
          </p>
        </div>

        {!isConfigured ? (
          <div className="callout-warn" role="status">
            Auth is not configured. Set the Supabase environment variables to enable password reset.
          </div>
        ) : sent ? (
          <div className="callout-success" role="status">
            If an account exists for <span style={{ fontWeight: 600 }}>{email.trim()}</span>, we've sent a reset link.
            Check your email.
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label className="form-label" htmlFor="reset-email">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  className="form-input"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
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
                {submitting ? 'Please wait…' : 'Send reset link'}
              </button>
            </form>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textAlign: 'center' }}>
              Remembered it? <Link to="/login">Log in</Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
