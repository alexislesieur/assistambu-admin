import { useEffect, useState } from 'react'
import { statsApi } from '../lib/api'

// Icônes
const IcoUsers    = ({ color, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
const IcoShift    = ({ color, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IcoPulse    = ({ color, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
const IcoBox      = ({ color, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
const IcoList     = ({ color, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const IcoAlert    = ({ color, size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const IcoCheck    = ({ color, size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IcoTrend    = ({ color, size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>

// Mini barre de progression
function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div style={{ height: 4, background: '#F0F2F5', borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
    </div>
  )
}

// Badge inline
function Badge({ label, color, bg }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, borderRadius: 6, padding: '2px 7px', letterSpacing: '0.04em' }}>
      {label}
    </span>
  )
}

// KPI principal
function KPICard({ icon, title, value, sub, color, details, alert }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 20,
      borderWidth: 1, borderStyle: 'solid',
      borderColor: alert ? '#FECACA' : '#E8ECF0',
      boxShadow: alert ? '0 0 0 2px #FEF2F2' : '0 1px 3px rgba(0,0,0,0.04)',
      flex: 1, minWidth: 200,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        {alert && <Badge label="Attention" color="#C0392B" bg="#FEF2F2" />}
      </div>

      {/* Valeur principale */}
      <div style={{ fontSize: 36, fontWeight: 800, color: '#0A1E3D', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 4 }}>
        {value ?? '—'}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#0A1E3D', marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 12, color: '#8694A7', marginBottom: 12 }}>{sub}</div>

      {/* Détails */}
      {details && (
        <div style={{ borderTop: '1px solid #F0F2F5', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {details.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#8694A7' }}>{d.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: d.color || '#0A1E3D' }}>{d.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Carte secondaire compacte
function MiniCard({ title, value, sub, color }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '14px 16px',
      borderWidth: 1, borderStyle: 'solid', borderColor: '#E8ECF0',
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    }}>
      <div style={{ fontSize: 11, color: '#8694A7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: color || '#0A1E3D', letterSpacing: '-0.03em' }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: 11, color: '#8694A7', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const load = () => {
    setLoading(true)
    statsApi.global()
      .then(data => { setStats(data); setLastRefresh(new Date()) })
      .catch(() => setError('Impossible de charger les statistiques.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  if (loading && !stats) return (
    <div style={{ padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #E8ECF0', borderTopColor: '#2E86C1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: 13, color: '#8694A7' }}>Chargement...</span>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ padding: 32 }}>
      <div style={{ background: '#FDF2F2', border: '1px solid #FACACA', borderRadius: 10, padding: 16, color: '#C0392B', fontSize: 13 }}>{error}</div>
    </div>
  )

  const conformPct = stats.items.total > 0
    ? Math.round(((stats.items.total - stats.items.low_stock - stats.items.expired) / stats.items.total) * 100)
    : 100

  const conformAlert = conformPct < 70 || stats.items.expired > 0

  return (
    <div style={{ padding: 32 }}>

      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1E3D', letterSpacing: '-0.03em', marginBottom: 3 }}>Dashboard</h1>
          <p style={{ fontSize: 12, color: '#8694A7' }}>
            Dernière mise à jour : {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8,
            padding: '8px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#4A5568',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          {loading ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      {/* KPIs principaux */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>

        <KPICard
          icon={<IcoUsers color="#2E86C1" />}
          title="Utilisateurs actifs"
          value={stats.users.verified}
          sub="Emails vérifiés"
          color="#2E86C1"
          details={[
            { label: 'Total inscrits',    value: stats.users.total },
            { label: 'Non vérifiés',      value: stats.users.total - stats.users.verified, color: stats.users.total - stats.users.verified > 0 ? '#D4860B' : '#1D8348' },
            { label: 'Nouveaux (7j)',     value: `+${stats.users.new_week}`, color: '#1D8348' },
            { label: 'Admins',            value: stats.users.admins, color: '#8E44AD' },
          ]}
        />

        <KPICard
          icon={<IcoShift color="#1D8348" />}
          title="Gardes en cours"
          value={stats.shifts.active}
          sub="Actuellement actives"
          color="#1D8348"
          details={[
            { label: 'Total gardes',      value: stats.shifts.total },
            { label: 'Cette semaine',     value: stats.shifts.this_week, color: '#2E86C1' },
          ]}
        />

        <KPICard
          icon={<IcoPulse color="#8E44AD" />}
          title="Interventions"
          value={stats.interventions.this_month}
          sub="30 derniers jours"
          color="#8E44AD"
          details={[
            { label: 'Total',             value: stats.interventions.total },
            { label: 'Cette semaine',     value: stats.interventions.this_week, color: '#2E86C1' },
          ]}
        />

        <KPICard
          icon={<IcoBox color={conformAlert ? '#C0392B' : '#1D8348'} />}
          title="Conformité sac"
          value={`${conformPct}%`}
          sub="Articles en règle"
          color={conformAlert ? '#C0392B' : '#1D8348'}
          alert={conformAlert}
          details={[
            { label: 'Articles total',    value: stats.items.total },
            { label: 'Stock faible',      value: stats.items.low_stock, color: stats.items.low_stock > 0 ? '#D4860B' : '#1D8348' },
            { label: 'DLC dépassée',      value: stats.items.expired,   color: stats.items.expired > 0 ? '#C0392B' : '#1D8348' },
          ]}
        />

        <KPICard
          icon={<IcoList color="#D4860B" />}
          title="Waitlist"
          value={stats.waitlist.total}
          sub="Inscrits au lancement"
          color="#D4860B"
          details={[
            { label: 'Cette semaine',     value: `+${stats.waitlist.new_week}`, color: '#1D8348' },
          ]}
        />

      </div>

      {/* Barre conformité */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, borderWidth: 1, borderStyle: 'solid', borderColor: '#E8ECF0', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0A1E3D' }}>Conformité globale du sac</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: conformAlert ? '#C0392B' : '#1D8348' }}>{conformPct}%</span>
        </div>
        <div style={{ height: 10, background: '#F0F2F5', borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
          {stats.items.total > 0 && (
            <>
              <div style={{ flex: stats.items.total - stats.items.low_stock - stats.items.expired, background: '#1D8348', transition: 'flex 0.6s' }} />
              <div style={{ flex: stats.items.low_stock, background: '#D4860B', transition: 'flex 0.6s' }} />
              <div style={{ flex: stats.items.expired, background: '#C0392B', transition: 'flex 0.6s' }} />
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: '#1D8348' }} />
            <span style={{ fontSize: 11, color: '#4A5568' }}>OK ({stats.items.total - stats.items.low_stock - stats.items.expired})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: '#D4860B' }} />
            <span style={{ fontSize: 11, color: '#4A5568' }}>Stock faible ({stats.items.low_stock})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: '#C0392B' }} />
            <span style={{ fontSize: 11, color: '#4A5568' }}>DLC dépassée ({stats.items.expired})</span>
          </div>
        </div>
      </div>

      {/* Alertes si nécessaire */}
      {(stats.items.expired > 0 || stats.shifts.active > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stats.items.expired > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px' }}>
              <IcoAlert color="#C0392B" />
              <span style={{ fontSize: 13, color: '#C0392B', fontWeight: 500 }}>
                {stats.items.expired} article{stats.items.expired > 1 ? 's' : ''} avec DLC dépassée — à remplacer immédiatement
              </span>
            </div>
          )}
          {stats.shifts.active > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px' }}>
              <IcoCheck color="#1D8348" />
              <span style={{ fontSize: 13, color: '#1D8348', fontWeight: 500 }}>
                {stats.shifts.active} garde{stats.shifts.active > 1 ? 's' : ''} en cours actuellement
              </span>
            </div>
          )}
        </div>
      )}

    </div>
  )
}