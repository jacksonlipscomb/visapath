import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchableSelect from '../components/SearchableSelect'
import { COUNTRIES, PURPOSES, getRoutesForPair } from '../data/visaRoutes'
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

  // Find the matched route (and its id) for the current selection
  const selectedRoute =
    originCode && destCode && selectedPurpose
      ? getRoutesForPair(originCode, destCode).find((r) => r.purpose === selectedPurpose) ?? null
      : null
  const selectedRouteId = selectedRoute?.id ?? null

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
      <div className="container" style={{ textAlign: 'center', padding: 'var(--space-8) 16px var(--space-6)' }}>
        <p
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: 'var(--space-4)',
          }}
        >
          Visa & entry requirements, made simple
        </p>
        <h1
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: 'var(--space-4)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Your step-by-step
          <br />
          visa roadmap
        </h1>
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--text-muted)',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Pick where you're coming from and where you're going. We'll show you every step, in order.
        </p>
      </div>

      {/* Selector card */}
      <div className="container" style={{ maxWidth: '560px' }}>
        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-5)', color: 'var(--text)' }}>
            Where are you going?
          </h2>

          {/* Country selectors */}
          <div className="route-selector" style={{ marginBottom: 'var(--space-5)' }}>
            <SearchableSelect
              label="From"
              options={originOptions}
              value={originCode}
              onChange={handleOriginChange}
              placeholder="Select origin"
            />

            <div className="route-selector__arrow" aria-hidden="true">
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
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <div className="form-label">Purpose of travel</div>

              {noPurposesAvailable ? (
                <div
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--neutral)',
                    border: '1px dashed var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-muted)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  Coming soon for this combination — check back later!
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
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
                          gap: 'var(--space-2)',
                          padding: 'var(--space-2) var(--space-4)',
                          borderRadius: '999px',
                          border: active ? '2px solid var(--accent)' : '2px solid var(--border)',
                          background: active ? 'var(--accent-light)' : available ? 'var(--surface)' : 'var(--neutral)',
                          color: active ? 'var(--accent-dark)' : available ? 'var(--text)' : 'var(--text-muted)',
                          fontWeight: active ? 700 : 500,
                          fontSize: 'var(--text-sm)',
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

          {/* Visa type preview — subtle, muted */}
          {selectedRoute && (
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-4)',
              }}
            >
              You'll likely need the <span style={{ color: 'var(--text)', fontWeight: 600 }}>{selectedRoute.visaType}</span>.
            </p>
          )}

          {/* CTA */}
          <button
            className="btn-primary"
            onClick={handleShowRoadmap}
            disabled={!canShowRoadmap}
            style={{ fontSize: 'var(--text-base)', width: '100%', justifyContent: 'center' }}
          >
            Show my roadmap →
          </button>
        </div>
      </div>
    </main>
  )
}
