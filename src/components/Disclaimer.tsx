export default function Disclaimer() {
  return (
    <div style={{ padding: '20px 0 28px' }}>
      <div className="container">
        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            textAlign: 'center',
          }}
        >
          Unofficial guide for informational purposes only — not legal advice. Always verify with
          official sources:{' '}
          <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer">
            travel.state.gov
          </a>
          {' · '}
          <a href="https://studyinthestates.dhs.gov" target="_blank" rel="noopener noreferrer">
            studyinthestates.dhs.gov
          </a>.
        </p>
      </div>
    </div>
  )
}
