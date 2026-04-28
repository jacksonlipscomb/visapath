import { useNavigate } from 'react-router-dom'
import type { VisaRoute } from '../data/visaRoutes'
import { PURPOSES } from '../data/visaRoutes'
import { useTranslatedRoute } from '../hooks/useTranslatedRoute'

type Props = {
  routes: VisaRoute[]
}

function RouteCard({ route }: { route: VisaRoute }) {
  const navigate = useNavigate()
  const translated = useTranslatedRoute(route) ?? route
  const purposeMeta = PURPOSES.find((p) => p.value === translated.purpose)

  return (
    <button
      key={translated.id}
      onClick={() => navigate(`/roadmap/${translated.id}`)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        boxShadow: 'var(--shadow)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = 'var(--shadow-md)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'var(--shadow)'
      }}
      aria-label={`View roadmap for ${translated.origin.name} to ${translated.destination.name} (${purposeMeta?.label ?? translated.purpose})`}
    >
      {/* Flag pair */}
      <div
        style={{
          fontSize: '2rem',
          lineHeight: 1,
          marginBottom: '10px',
          letterSpacing: '4px',
        }}
      >
        {translated.origin.flag} → {translated.destination.flag}
      </div>

      {/* Names */}
      <div
        style={{
          fontWeight: 700,
          fontSize: '0.95rem',
          marginBottom: '8px',
          color: 'var(--text)',
        }}
      >
        {translated.origin.name} → {translated.destination.name}
      </div>

      {/* Purpose badge */}
      <div style={{ marginBottom: '8px' }}>
        <span className="purpose-badge">
          {purposeMeta?.emoji} {purposeMeta?.label ?? translated.purpose}
        </span>
      </div>

      {/* Visa type */}
      <div
        style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginBottom: '6px',
        }}
      >
        {translated.visaType}
      </div>

      {/* Cost */}
      <div
        style={{
          fontSize: '0.78rem',
          color: 'var(--accent)',
          fontWeight: 600,
        }}
      >
        {translated.estimatedCost}
      </div>
    </button>
  )
}

export default function PopularRoutes({ routes }: Props) {
  return (
    <section style={{ marginTop: '48px', marginBottom: '48px' }}>
      <h2
        style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          marginBottom: '20px',
          color: 'var(--text)',
        }}
      >
        Popular routes
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    </section>
  )
}
