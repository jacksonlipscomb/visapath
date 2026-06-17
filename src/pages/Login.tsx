import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForm from '../components/AuthForm'

export default function Login() {
  const { user, loading, isConfigured } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true })
  }, [user, loading, navigate])

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
            Log in
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            Welcome back to VisaPath.
          </p>
        </div>

        {isConfigured ? (
          <>
            <AuthForm mode="login" />
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textAlign: 'center' }}>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </>
        ) : (
          <div className="callout-warn" role="status">
            Auth is not configured. Set the Supabase environment variables to enable login.
          </div>
        )}
      </div>
    </main>
  )
}
