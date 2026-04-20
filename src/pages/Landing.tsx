import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchableSelect from '../components/SearchableSelect'
import PopularRoutes from '../components/PopularRoutes'
import { COUNTRIES, PURPOSES, getAllRoutes, getRoutesForPair } from '../data/visaRoutes'
import type { Purpose } from '../data/visaRoutes'

export default function Landing() {
  const navigate = useNavigate()

  const [originCode, setOriginCode] = useState('')
  const [destCode, setDestCode] = useState('')
  const [selectedPurpose, setSelectedPurpose] = useState<Purpose | ''>('')

  // Filter out same-country pairs
  const destOptions = originCode ? COUNTRIES.filter((c) => c.code !== originCode) : COUNTRIES
  const originOptions = destCode ? COUNTRIES.filter((c) => c.code !== destCode) : COUNTRIES

  // Available purposes for selected pair
  const availablePurposes =
    originCode && destCode
      ? getRoutesForPair(originCode, destCode).map((r) => r.purpose)
      : []

  const noPurposesAvailable = originCode && destCode && availablePurposes.length === 0

  // Find the route id
  const selectedRouteId =
    originCode && destCode && selectedPurpose
      ? getRoutesForPair(originCode, destCode).find((r) => r.purpose === selectedPurpose)?.id ?? null
      : null

  function handleOriginChange(code: string) {
    setOriginCode(code)
    setSelectedPurpose('')
    if (code === destCode) setDestCode('')
  }

  function handleDestChange(code: string) {
    setDestCode(code)
    setSelectedPurpose('')
    if (code === originCode) setOriginCode('')
  }

  function handleShowRoadmap() {
    if (selectedRouteId) {
      navigate(`/roadmap/${selectedRouteId}`)
    }
  }

  const canShowRoadmap = !!selectedRouteId

  return (
    <main>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(160deg, var(--accent-light) 0%, var(--bg) 60%)',
          padding: '48px 0 32px',
        }}
      >
        <div className="container">
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '10px',
            }}
          >
            VisaPath
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: '12px',
              lineHeight: 1.2,
            }}
          >
            Your step-by-step<br />visa roadmap
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              maxWidth: '460px',
              lineHeight: 1.6,
            }}
          >
            Visual, numbered instructions — like IKEA for immigration.
          </p>
        </div>
      </div>

      {/* Selector card */}
      <div className="container">
        <div
          className="card"
          style={{
            padding: '28px',
            marginTop: '-16px',
            marginBottom: '0',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text)' }}>
            Where are you going?
          </h2>

          {/* Country selectors */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: '12px',
              alignItems: 'end',
              marginBottom: '20px',
            }}
          >
            <SearchableSelect
              label="From"
              options={originOptions}
              value={originCode}
              onChange={handleOriginChange}
              placeholder="Select origin"
            />

            <div
              style={{
                fontSize: '1.4rem',
                color: 'var(--text-muted)',
                paddingBottom: '8px',
                textAlign: 'center',
                alignSelf: 'end',
              }}
            >
              →
            </div>

            <SearchableSelect
              label="To"
              options={destOptions}
              value={destCode}
              onChange={handleDestChange}
              placeholder="Select destination"
            />
          </div>

          {/* Purpose pills */}
          {originCode && destCode && (
            <div style={{ marginBottom: '20px' }}>
              <div className="form-label">Purpose of travel</div>

              {noPurposesAvailable ? (
                <div
                  style={{
                    padding: '12px 16px',
                    background: '#f9f9f7',
                    border: '1px dashed var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                  }}
                >
                  Coming soon for this combination — check back later!
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PURPOSES.map((p) => {
                    const available = availablePurposes.includes(p.value)
                    const active = selectedPurpose === p.value
                    return (
                      <button
                        key={p.value}
                        onClick={() => available && setSelectedPurpose(p.value)}
                        disabled={!available}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          borderRadius: '999px',
                          border: active ? '2px solid var(--accent)' : '2px solid var(--border)',
                          background: active ? 'var(--accent-light)' : available ? 'var(--surface)' : '#f0f0ee',
                          color: active ? 'var(--accent-dark)' : available ? 'var(--text)' : 'var(--text-muted)',
                          fontWeight: active ? 700 : 500,
                          fontSize: '0.9rem',
                          cursor: available ? 'pointer' : 'not-allowed',
                          opacity: available ? 1 : 0.45,
                          transition: 'all 0.12s ease',
                          fontFamily: 'var(--font)',
                        }}
                        aria-pressed={active}
                        title={!available ? 'Not available for this route yet' : undefined}
                      >
                        <span>{p.emoji}</span>
                        <span>{p.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Stay duration toggle (informational) */}
          {originCode && destCode && selectedPurpose === 'tourist' && (
            <div style={{ marginBottom: '20px' }}>
              <div className="form-label">Intended stay length</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Under 90 days', '90 days – 1 year', 'Over 1 year'].map((label) => (
                  <span
                    key={label}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: '1.5px solid var(--border)',
                      background: label === 'Under 90 days' ? 'var(--accent-light)' : 'var(--surface)',
                      color: label === 'Under 90 days' ? 'var(--accent-dark)' : 'var(--text-muted)',
                      fontSize: '0.82rem',
                      fontWeight: label === 'Under 90 days' ? 700 : 400,
                      cursor: 'default',
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Informational only. For stays over 90 days, a long-stay visa or residence permit is typically required.
              </p>
            </div>
          )}

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={handleShowRoadmap}
              disabled={!canShowRoadmap}
              style={{ fontSize: '1rem' }}
            >
              Show my roadmap →
            </button>
            {!canShowRoadmap && originCode && destCode && selectedPurpose && (
              <span style={{ fontSize: '0.85rem', color: 'var(--warn)' }}>
                No roadmap available for this combination yet.
              </span>
            )}
          </div>
        </div>

        {/* Popular routes */}
        <PopularRoutes routes={getAllRoutes()} />
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '24px 0',
          marginTop: '16px',
          background: 'var(--surface)',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            VisaPath — for informational purposes only. Not legal advice.
          </p>
        </div>
      </footer>
    </main>
  )
}
