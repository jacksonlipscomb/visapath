export default function Disclaimer() {
  return (
    <div
      style={{
        background: '#fffbe6',
        borderBottom: '2px solid #f0d060',
        padding: '10px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            flexWrap: 'wrap',
            fontSize: '0.82rem',
            lineHeight: 1.5,
          }}
        >
          {/* Warning triangle SVG */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#b7791f"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, marginTop: '1px' }}
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span style={{ color: '#7d5a00' }}>
            <strong>Unofficial guide</strong> — always verify with official sources. This page is for informational
            purposes only and is not legal advice.{' '}
            <a
              href="https://travel.state.gov"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#b7791f', fontWeight: 600 }}
            >
              travel.state.gov
            </a>
            {' · '}
            <a
              href="https://studyinthestates.dhs.gov"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#b7791f', fontWeight: 600 }}
            >
              studyinthestates.dhs.gov
            </a>
            {' · '}
            <span style={{ color: '#a07020' }}>Last updated: April 2026</span>
          </span>
        </div>
      </div>
    </div>
  )
}
