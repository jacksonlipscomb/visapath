type Props = {
  totalDocs: number
  checkedDocs: number
}

export default function ProgressBar({ totalDocs, checkedDocs }: Props) {
  const pct = totalDocs === 0 ? 0 : Math.round((checkedDocs / totalDocs) * 100)

  return (
    <div
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '10px 0',
        position: 'sticky',
        top: '48px', // below the disclaimer
        zIndex: 90,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: 600 }}>
            {checkedDocs} of {totalDocs} documents checked
          </span>

          {/* Fill bar */}
          <div
            style={{
              flex: 1,
              height: '8px',
              background: '#e4e2dd',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                background:
                  pct === 100
                    ? 'var(--success)'
                    : pct > 60
                    ? 'var(--accent)'
                    : pct > 30
                    ? '#f59e0b'
                    : 'var(--accent)',
                borderRadius: '999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: pct === 100 ? 'var(--success)' : 'var(--accent)',
              minWidth: '38px',
              textAlign: 'right',
            }}
          >
            {pct}%
          </span>
        </div>
      </div>
    </div>
  )
}
