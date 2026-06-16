import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const { i18n } = useTranslation()

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

        {/* Language toggle — quiet secondary control */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }} aria-label="Language">
          {langButton('en', 'EN')}
          <span style={{ color: 'var(--border)', fontSize: 'var(--text-xs)' }}>|</span>
          {langButton('sv', 'SV')}
        </nav>
      </div>
    </header>
  )
}
