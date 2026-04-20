import { useState, useEffect } from 'react'
import type { VisaStep } from '../data/visaRoutes'
import { PHASE_LABELS } from '../data/visaRoutes'

type Props = {
  step: VisaStep
  stepNumber: number
  checkedDocs: Set<string>
  onDocToggle: (docName: string) => void
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function StepCard({ step, stepNumber, checkedDocs, onDocToggle }: Props) {
  const isMobile = useIsMobile()
  const [expanded, setExpanded] = useState(!isMobile)

  // When screen size changes, update expansion state for new cards
  useEffect(() => {
    setExpanded(!isMobile)
  }, [isMobile])

  const phaseClass = `phase-badge phase-${step.phase}`

  return (
    <div
      className="card"
      style={{ marginBottom: '12px', overflow: 'hidden' }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        aria-expanded={expanded}
      >
        {/* Step number circle */}
        <div
          style={{
            width: '32px',
            height: '32px',
            minWidth: '32px',
            borderRadius: '50%',
            background: 'var(--accent)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginTop: '2px',
          }}
        >
          {stepNumber}
        </div>

        {/* Title + badges */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.4, marginBottom: '6px' }}>
            {step.title}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            <span className={phaseClass}>{PHASE_LABELS[step.phase]}</span>
            {step.estimatedTime && (
              <span
                style={{
                  fontSize: '0.72rem',
                  background: '#f3f4f6',
                  color: 'var(--text-muted)',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontWeight: 600,
                }}
              >
                {step.estimatedTime}
              </span>
            )}
          </div>
        </div>

        {/* Expand arrow */}
        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.7rem',
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            display: 'inline-block',
            marginTop: '8px',
            flexShrink: 0,
          }}
        >
          ▼
        </span>
      </button>

      {/* Body */}
      {expanded && (
        <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid var(--border)' }}>
          {/* Description */}
          <p style={{ marginTop: '16px', marginBottom: '16px', color: 'var(--text)', fontSize: '0.95rem' }}>
            {step.description}
          </p>

          {/* Documents */}
          {step.documents.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                }}
              >
                You need
              </div>
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                {step.documents.map((doc) => {
                  const docKey = `${step.id}::${doc.name}`
                  const isChecked = checkedDocs.has(docKey)
                  return (
                    <label
                      key={doc.name}
                      className="doc-checkbox"
                      style={{
                        padding: '10px 14px',
                        background: isChecked ? 'var(--success-light)' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onDocToggle(docKey)}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span className="doc-name">
                          {doc.name}
                          <span className={doc.required ? 'doc-required-badge' : 'doc-optional-badge'}>
                            {doc.required ? 'Required' : 'Optional'}
                          </span>
                        </span>
                        {doc.description && (
                          <div className="doc-desc">{doc.description}</div>
                        )}
                        {doc.whereToGet && (
                          <div className="doc-where">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            Where to get: {doc.whereToGet}
                          </div>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tips */}
          {step.tips && step.tips.length > 0 && (
            <div className="callout-blue" style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: 'var(--accent-dark)',
                }}
              >
                {/* Lightbulb icon */}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="9" y1="18" x2="15" y2="18" />
                  <line x1="10" y1="22" x2="14" y2="22" />
                  <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                </svg>
                Tips
              </div>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {step.tips.map((tip, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '0.87rem',
                      color: 'var(--text)',
                      marginBottom: i < step.tips!.length - 1 ? '5px' : 0,
                      listStyleType: 'disc',
                    }}
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Estimated cost badge */}
          {step.estimatedCost && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fcd34d',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontWeight: 600,
                }}
              >
                Cost: {step.estimatedCost}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
