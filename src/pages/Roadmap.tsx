import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRoute, PHASE_LABELS } from '../data/visaRoutes'
import type { VisaStep } from '../data/visaRoutes'
import { useTranslatedRoute } from '../hooks/useTranslatedRoute'
import StepCard from '../components/StepCard'
import ProgressBar from '../components/ProgressBar'
import Sidebar from '../components/Sidebar'
import ComingSoon from './ComingSoon'
import { PURPOSES } from '../data/visaRoutes'
import { generateChecklistPDF } from '../utils/generateChecklistPDF'

export default function Roadmap() {
  const { routeId } = useParams<{ routeId: string }>()
  const route = routeId ? getRoute(routeId) : undefined
  const translated = useTranslatedRoute(route)

  // localStorage key for checked docs
  const storageKey = `visapath_${routeId}_docs`

  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const arr = JSON.parse(raw) as string[]
        return new Set(arr)
      }
    } catch {
      // ignore
    }
    return new Set()
  })

  // Persist to localStorage whenever checkedDocs changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(Array.from(checkedDocs)))
  }, [checkedDocs, storageKey])

  function handleDocToggle(docKey: string) {
    setCheckedDocs((prev) => {
      const next = new Set(prev)
      if (next.has(docKey)) {
        next.delete(docKey)
      } else {
        next.add(docKey)
      }
      return next
    })
  }

  // Calculate total docs
  const totalDocs = useMemo(() => {
    if (!translated) return 0
    return translated.steps.reduce((sum, step) => sum + step.documents.length, 0)
  }, [translated])

  const checkedCount = checkedDocs.size

  if (!translated) {
    return <ComingSoon />
  }

  // Group steps by phase
  const phaseOrder: VisaStep['phase'][] = [
    'before-applying',
    'applying',
    'interview',
    'pre-departure',
    'on-arrival',
    'in-country',
  ]

  const stepsByPhase: Partial<Record<VisaStep['phase'], VisaStep[]>> = {}
  for (const step of translated.steps) {
    if (!stepsByPhase[step.phase]) stepsByPhase[step.phase] = []
    stepsByPhase[step.phase]!.push(step)
  }

  const purposeMeta = PURPOSES.find((p) => p.value === translated.purpose)

  // Running step number
  let stepCounter = 0

  return (
    <>
      <ProgressBar totalDocs={totalDocs} checkedDocs={checkedCount} />

      <main style={{ paddingBottom: '48px' }}>
        <div className="container" style={{ paddingTop: '24px' }}>
          {/* Breadcrumb */}
          <nav className="breadcrumb" style={{ marginBottom: '16px' }}>
            <Link to="/">VisaPath</Link>
            <span className="breadcrumb-sep">/</span>
            <span>
              {translated.origin.flag} {translated.origin.name} → {translated.destination.flag} {translated.destination.name}
            </span>
            <span className="breadcrumb-sep">/</span>
            <span>{translated.visaType}</span>
          </nav>

          {/* Route header */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.6rem' }}>
                {translated.origin.flag} → {translated.destination.flag}
              </span>
              <span className="purpose-badge">
                {purposeMeta?.emoji} {purposeMeta?.label ?? translated.purpose}
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
                fontWeight: 800,
                color: 'var(--text)',
                marginBottom: '12px',
                lineHeight: 1.3,
              }}
            >
              {translated.origin.name} → {translated.destination.name}: {translated.visaType}
            </h1>

            <p style={{ fontSize: '0.97rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '600px' }}>
              {translated.summary}
            </p>
          </div>

          {/* Athlete note */}
          {translated.athleteNote && (
            <div
              className="callout-blue"
              style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}
            >
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🏅</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.87rem', color: 'var(--accent-dark)', marginBottom: '4px' }}>
                  Student Athlete Note
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{translated.athleteNote}</p>
              </div>
            </div>
          )}

          {/* Key stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '28px',
            }}
          >
            <div className="stat-box">
              <div className="stat-label">Processing Time</div>
              <div className="stat-value">{translated.processingTime}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Stay Duration</div>
              <div className="stat-value">{translated.stayDuration}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Estimated Cost</div>
              <div className="stat-value">{translated.estimatedCost}</div>
            </div>
          </div>

          {/* Download PDF — Place 1 */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => generateChecklistPDF(routeId!)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '10px 18px',
                background: '#0d9488',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.87rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#0f766e')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#0d9488')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Checklist PDF
            </button>
          </div>

          {/* Two-column layout */}
          <div className="two-col">
            {/* Steps */}
            <div>
              {phaseOrder.map((phase) => {
                const steps = stepsByPhase[phase]
                if (!steps || steps.length === 0) return null

                return (
                  <section key={phase} style={{ marginBottom: '28px' }}>
                    {/* Phase header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                        paddingBottom: '8px',
                        borderBottom: '2px solid var(--border)',
                      }}
                    >
                      <span className={`phase-badge phase-${phase}`} style={{ fontSize: '0.78rem' }}>
                        {PHASE_LABELS[phase]}
                      </span>
                    </div>

                    {steps.map((step) => {
                      stepCounter += 1
                      return (
                        <StepCard
                          key={step.id}
                          step={step}
                          stepNumber={stepCounter}
                          checkedDocs={checkedDocs}
                          onDocToggle={handleDocToggle}
                        />
                      )
                    })}
                  </section>
                )
              })}

              {/* Completion message */}
              {checkedCount > 0 && checkedCount === totalDocs && (
                <div
                  className="callout-success"
                  style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--success)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <div>
                    <strong>All documents checked!</strong> Good luck with your application. Always verify details with
                    official sources.
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="sidebar-sticky">
              {/* Download PDF — Place 2 */}
              <div className="card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
                <button
                  onClick={() => generateChecklistPDF(routeId!)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    width: '100%',
                    padding: '10px 16px',
                    background: '#0d9488',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.87rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#0f766e')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#0d9488')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Checklist PDF
                </button>
              </div>
              <Sidebar route={translated} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
