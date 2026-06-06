import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ComingSoon() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <main>
      <div
        className="container"
        style={{
          minHeight: '60vh',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--space-8) 16px',
          gap: 'var(--space-5)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: 'var(--space-3)',
              letterSpacing: '-0.01em',
            }}
          >
            This route is coming soon
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            We're adding more visa paths. Leave your email and we'll let you know when this one is ready.
          </p>
        </div>

        {/* Email notify */}
        <div style={{ width: '100%' }}>
          {submitted ? (
            <div
              className="callout-success"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', justifyContent: 'center' }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--success)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>Thanks, we'll let you know!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                id="notify-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ whiteSpace: 'nowrap', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)' }}
              >
                Notify me
              </button>
            </form>
          )}
        </div>

        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            color: 'var(--accent)',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to home
        </Link>
      </div>
    </main>
  )
}
