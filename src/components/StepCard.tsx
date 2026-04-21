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

// ── Inline SVG icons ────────────────────────────────────────────────────────

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  )
}

function QuestionIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function StepCard({ step, stepNumber, checkedDocs, onDocToggle }: Props) {
  const isMobile = useIsMobile()
  const [expanded, setExpanded] = useState(!isMobile)
  const [questionsOpen, setQuestionsOpen] = useState(false)

  useEffect(() => {
    setExpanded(!isMobile)
  }, [isMobile])

  const phaseClass = `phase-badge phase-${step.phase}`

  return (
    <div className="card" style={{ marginBottom: '12px', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '16px 20px', display: 'flex', alignItems: 'flex-start',
          gap: '14px', cursor: 'pointer', textAlign: 'left',
        }}
        aria-expanded={expanded}
      >
        <div style={{
          width: '32px', height: '32px', minWidth: '32px', borderRadius: '50%',
          background: 'var(--accent)', color: '#fff', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', fontWeight: 700, marginTop: '2px',
        }}>
          {stepNumber}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.4, marginBottom: '6px' }}>
            {step.title}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            <span className={phaseClass}>{PHASE_LABELS[step.phase]}</span>
            {step.estimatedTime && (
              <span style={{
                fontSize: '0.72rem', background: '#f3f4f6', color: 'var(--text-muted)',
                padding: '2px 8px', borderRadius: '20px', fontWeight: 600,
              }}>
                {step.estimatedTime}
              </span>
            )}
          </div>
        </div>

        <span style={{
          color: 'var(--text-muted)', fontSize: '0.7rem',
          transform: expanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s', display: 'inline-block',
          marginTop: '8px', flexShrink: 0,
        }}>▼</span>
      </button>

      {/* ── Body ── */}
      {expanded && (
        <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid var(--border)' }}>

          {/* Description */}
          <p style={{ marginTop: '16px', marginBottom: '16px', color: 'var(--text)', fontSize: '0.95rem' }}>
            {step.description}
          </p>

          {/* ── Action Links ── */}
          {step.officialLinks && step.officialLinks.length > 0 && (
            <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {step.officialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '9px 16px',
                    background: '#0d9488',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem', fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#0f766e')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#0d9488')}
                >
                  <ExternalLinkIcon />
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* ── Documents ── */}
          {step.documents.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '8px',
              }}>
                You need
              </div>
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                {step.documents.map((doc) => {
                  const docKey = `${step.id}::${doc.name}`
                  const isChecked = checkedDocs.has(docKey)
                  return (
                    <label key={doc.name} className="doc-checkbox" style={{
                      padding: '10px 14px',
                      background: isChecked ? 'var(--success-light)' : 'transparent',
                      transition: 'background 0.15s',
                    }}>
                      <input type="checkbox" checked={isChecked} onChange={() => onDocToggle(docKey)} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span className="doc-name">
                          {doc.name}
                          <span className={doc.required ? 'doc-required-badge' : 'doc-optional-badge'}>
                            {doc.required ? 'Required' : 'Optional'}
                          </span>
                        </span>
                        {doc.description && <div className="doc-desc">{doc.description}</div>}
                        {doc.whereToGet && (
                          <div className="doc-where">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
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

          {/* ── Tips ── */}
          {step.tips && step.tips.length > 0 && (
            <div className="callout-blue" style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                marginBottom: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-dark)',
              }}>
                <LightbulbIcon />
                Tips
              </div>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {step.tips.map((tip, i) => (
                  <li key={i} style={{
                    fontSize: '0.87rem', color: 'var(--text)',
                    marginBottom: i < step.tips!.length - 1 ? '5px' : 0,
                    listStyleType: 'disc',
                  }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Interview Prep ── */}
          {step.interviewPrep && (
            <div style={{
              border: '2px solid #e0f2fe',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              marginBottom: '16px',
            }}>
              {/* Section header */}
              <div style={{
                background: '#f0f9ff',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid #e0f2fe',
              }}>
                <span style={{ color: '#0369a1' }}><BagIcon /></span>
                <span style={{
                  fontWeight: 700, fontSize: '0.9rem', color: '#0369a1',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  What to Bring to Your Interview
                </span>
              </div>

              {/* What to bring checklist */}
              <div style={{ background: '#fff' }}>
                {step.interviewPrep.whatToBring.map((item) => {
                  const itemKey = `${step.id}::prep::${item.item}`
                  const isChecked = checkedDocs.has(itemKey)
                  return (
                    <label key={item.item} className="doc-checkbox" style={{
                      padding: '10px 16px',
                      background: isChecked ? '#f0fdf4' : 'transparent',
                      borderBottom: '1px solid #f0f9ff',
                      transition: 'background 0.15s',
                    }}>
                      <input type="checkbox" checked={isChecked} onChange={() => onDocToggle(itemKey)} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                          {item.item}
                        </span>
                        {item.note && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {item.note}
                          </div>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>

              {/* Common questions — collapsible */}
              {step.interviewPrep.commonQuestions && step.interviewPrep.commonQuestions.length > 0 && (
                <div style={{ borderTop: '1px solid #e0f2fe' }}>
                  <button
                    onClick={() => setQuestionsOpen((v) => !v)}
                    style={{
                      width: '100%', background: '#f0f9ff', border: 'none',
                      padding: '10px 16px', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', cursor: 'pointer',
                      fontWeight: 600, fontSize: '0.85rem', color: '#0369a1',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <QuestionIcon />
                      Questions you might be asked
                    </span>
                    <ChevronIcon open={questionsOpen} />
                  </button>

                  {questionsOpen && (
                    <ul style={{
                      margin: 0, padding: '10px 16px 12px 32px',
                      background: '#fff', listStyleType: 'disc',
                    }}>
                      {step.interviewPrep.commonQuestions.map((q, i) => (
                        <li key={i} style={{
                          fontSize: '0.87rem', color: 'var(--text)',
                          marginBottom: i < step.interviewPrep!.commonQuestions!.length - 1 ? '5px' : 0,
                        }}>
                          {q}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Interview tips */}
              {step.interviewPrep.tips && step.interviewPrep.tips.length > 0 && (
                <div style={{
                  borderTop: '1px solid #e0f2fe',
                  background: '#f0f9ff',
                  padding: '12px 16px',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginBottom: '8px', fontWeight: 700, fontSize: '0.82rem', color: '#0369a1',
                  }}>
                    <LightbulbIcon />
                    Interview tips
                  </div>
                  <ul style={{ paddingLeft: '16px', margin: 0 }}>
                    {step.interviewPrep.tips.map((tip, i) => (
                      <li key={i} style={{
                        fontSize: '0.85rem', color: '#0c4a6e',
                        marginBottom: i < step.interviewPrep!.tips!.length - 1 ? '5px' : 0,
                        listStyleType: 'disc',
                      }}>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Cost badge */}
          {step.estimatedCost && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.78rem', background: '#fef3c7', color: '#92400e',
                border: '1px solid #fcd34d', padding: '3px 10px',
                borderRadius: '20px', fontWeight: 600,
              }}>
                Cost: {step.estimatedCost}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
