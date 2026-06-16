import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Disclaimer from './components/Disclaimer'
import Landing from './pages/Landing'
import Roadmap from './pages/Roadmap'
import ComingSoon from './pages/ComingSoon'
import { useAuth } from './context/AuthContext'

const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))

function AuthNotice() {
  const { justSignedIn, authError, error, clearAuthNotice } = useAuth()
  const problem = authError || error
  if (!justSignedIn && !problem) return null
  const isError = !!problem
  return (
    <div
      style={{
        background: isError ? 'var(--warn-light)' : 'var(--success-light)',
        borderBottom: `1px solid ${isError ? 'var(--warn)' : 'var(--success)'}`,
        padding: 'var(--space-2) 0',
      }}
    >
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}
      >
        <span style={{ fontSize: 'var(--text-sm)', color: isError ? 'var(--warn)' : 'var(--success)' }}>
          {isError ? problem : 'Email verified — you’re signed in.'}
        </span>
        <button
          onClick={clearAuthNotice}
          aria-label="Dismiss"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <AuthNotice />
      <Suspense fallback={<div className="container" style={{ padding: 'var(--space-7) 16px' }} />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/roadmap/:routeId" element={<Roadmap />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </Suspense>
      <Disclaimer />
    </>
  )
}
