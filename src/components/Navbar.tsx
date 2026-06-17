import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { i18n } = useTranslation()
  const { user, loading, isConfigured, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    setSigningOut(false)
  }

  const langButton = (lang: 'en' | 'sv', label: string) => {
    const active = i18n.language === lang
    return (
      <button
        onClick={() => i18n.changeLanguage(lang)}
        aria-pressed={active}
        className={active ? 'lang-btn active' : 'lang-btn'}
      >
        {label}
      </button>
    )
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 'var(--nav-height)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        className="container"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 800,
            color: 'var(--text)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          Visa<span style={{ color: 'var(--accent)' }}>Path</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Auth controls — only when Supabase is configured and initial load settled */}
          {isConfigured && !loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {user ? (
                <>
                  <span className="nav-email" title={user.email}>
                    {user.email}
                  </span>
                  <button className="lang-btn" onClick={handleSignOut} disabled={signingOut}>
                    {signingOut ? 'Logging out…' : 'Log out'}
                  </button>
                </>
              ) : (
                <Link to="/login" className="lang-btn" style={{ textDecoration: 'none' }}>
                  Log in
                </Link>
              )}
            </div>
          )}

          {/* Language toggle — quiet secondary control */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }} aria-label="Language">
            {langButton('en', 'EN')}
            <span style={{ color: 'var(--border)', fontSize: 'var(--text-xs)' }}>|</span>
            {langButton('sv', 'SV')}
          </nav>
        </div>
      </div>
    </header>
  )
}
