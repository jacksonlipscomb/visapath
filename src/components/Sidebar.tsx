import { Link } from 'react-router-dom'
import type { VisaRoute } from '../data/visaRoutes'

type Props = {
  route: VisaRoute
}

export default function Sidebar({ route }: Props) {
  return (
    <aside>
      {/* Official links */}
      <div
        className="card"
        style={{ padding: '20px', marginBottom: '16px' }}
      >
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
            marginBottom: '12px',
          }}
        >
          Official Sources
        </h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {route.officialLinks.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.87rem',
                  color: 'var(--accent)',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {/* External link icon */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Timeline */}
      <div
        className="card"
        style={{ padding: '20px', marginBottom: '16px' }}
      >
        <h3
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
            marginBottom: '8px',
          }}
        >
          Timeline
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          {/* Clock icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, marginTop: '2px' }}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p style={{ fontSize: '0.87rem', color: 'var(--text)', lineHeight: 1.5 }}>
            {route.processingTime}
          </p>
        </div>
      </div>

      {/* Navigation & info */}
      <div
        className="card"
        style={{ padding: '20px' }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: 'var(--accent)',
            marginBottom: '14px',
            textDecoration: 'none',
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
          Start over
        </Link>

        <hr className="divider" style={{ margin: '0 0 14px 0' }} />

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '8px' }}>
          Last updated: April 2026
        </p>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          This guide is for informational purposes only and is not legal advice. Always verify with official government
          sources before submitting applications.
        </p>
      </div>
    </aside>
  )
}
