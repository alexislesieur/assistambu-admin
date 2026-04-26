import { useEffect, useState } from 'react'
import { itemsApi } from '../lib/api'

const IcoSearch = ({ color = '#8694A7' }) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcoX      = ({ color = '#4A5568' }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcoEye    = ({ color = '#2E86C1' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IcoAlert  = ({ color = '#D4860B' }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>

function getStatus(item) {
  if (item.quantity === 0) return 'danger'
  if (item.dlc) {
    const diff = Math.floor((new Date(item.dlc) - new Date()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return 'danger'
    if (diff < 90) return 'warning'
  }
  if (item.max_quantity && item.quantity < item.max_quantity * 0.3) return 'warning'
  return 'ok'
}

const STATUS_STYLES = {
  ok:      { color: '#1D8348', bg: '#E6F2EC', label: 'OK' },
  warning: { color: '#D4860B', bg: '#FBF1E0', label: 'Alerte' },
  danger:  { color: '#C0392B', bg: '#FEF2F2', label: 'Épuisé' },
}

function Badge({ label, color, bg }) {
  return <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, borderRadius: 6, padding: '2px 8px' }}>{label}</span>
}

function formatDLC(dlc) {
  if (!dlc) return 'N/A'
  return new Date(dlc).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' })
}

function ItemModal({ item, onClose }) {
  const status = getStatus(item)
  const st = STATUS_STYLES[status]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 420, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A1E3D' }}>Détail article</h2>
          <button onClick={onClose} style={{ background: '#F0F2F5', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcoX /></button>
        </div>

        <div style={{ background: '#F7F8FA', borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0A1E3D', marginBottom: 4 }}>{item.name}</div>
          <div style={{ fontSize: 12, color: '#8694A7' }}>Catégorie : {item.category}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: '#F7F8FA', borderRadius: 10, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: st.color }}>{item.quantity}</div>
            <div style={{ fontSize: 10, color: '#8694A7', marginTop: 2 }}>Quantité actuelle</div>
          </div>
          <div style={{ background: '#F7F8FA', borderRadius: 10, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0A1E3D' }}>{item.max_quantity || '—'}</div>
            <div style={{ fontSize: 10, color: '#8694A7', marginTop: 2 }}>Quantité max</div>
          </div>
        </div>

        {[
          { label: 'Utilisateur', value: item.user ? `${item.user.name} (${item.user.email})` : '—' },
          { label: 'DLC',         value: formatDLC(item.dlc) },
          { label: 'Statut',      value: <Badge label={st.label} color={st.color} bg={st.bg} /> },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #F0F2F5' }}>
            <span style={{ fontSize: 12, color: '#8694A7' }}>{row.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1E3D' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SacPage() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    itemsApi.index().then(setItems).finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(item => {
    const matchSearch = !search
      || item.name?.toLowerCase().includes(search.toLowerCase())
      || item.category?.toLowerCase().includes(search.toLowerCase())
      || item.user?.name?.toLowerCase().includes(search.toLowerCase())
    const status = getStatus(item)
    if (filter === 'warning') return matchSearch && status === 'warning'
    if (filter === 'danger')  return matchSearch && status === 'danger'
    if (filter === 'ok')      return matchSearch && status === 'ok'
    return matchSearch
  })

  const okCount      = items.filter(i => getStatus(i) === 'ok').length
  const warnCount    = items.filter(i => getStatus(i) === 'warning').length
  const dangerCount  = items.filter(i => getStatus(i) === 'danger').length
  const conformPct   = items.length > 0 ? Math.round((okCount / items.length) * 100) : 100

  const FILTERS = [
    { id: 'all',     label: 'Tous',       count: items.length },
    { id: 'warning', label: 'Alertes',    count: warnCount,   color: '#D4860B' },
    { id: 'danger',  label: 'Épuisés',    count: dangerCount, color: '#C0392B' },
    { id: 'ok',      label: 'OK',         count: okCount,     color: '#1D8348' },
  ]

  return (
    <div style={{ padding: 32 }}>
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}

      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1E3D', letterSpacing: '-0.03em', marginBottom: 3 }}>Sac & Articles</h1>
          <p style={{ fontSize: 12, color: '#8694A7' }}>{items.length} article{items.length > 1 ? 's' : ''} · conformité globale {conformPct}%</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 12px', height: 36 }}>
          <IcoSearch />
          <input type="text" placeholder="Rechercher un article..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1C1F26', background: 'transparent', width: 200 }} />
        </div>
      </div>

      {/* Barre conformité */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', border: '1px solid #E8ECF0', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, background: '#F0F2F5', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
            <div style={{ flex: okCount, background: '#1D8348', transition: 'flex 0.6s' }} />
            <div style={{ flex: warnCount, background: '#D4860B', transition: 'flex 0.6s' }} />
            <div style={{ flex: dangerCount, background: '#C0392B', transition: 'flex 0.6s' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
          {[{ color: '#1D8348', label: `${okCount} OK` }, { color: '#D4860B', label: `${warnCount} alertes` }, { color: '#C0392B', label: `${dangerCount} épuisés` }].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
              <span style={{ fontSize: 11, color: '#4A5568' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', background: filter === f.id ? '#0A1E3D' : '#fff', color: filter === f.id ? '#fff' : f.color || '#4A5568', fontSize: 12, fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            {f.label}
            <span style={{ background: filter === f.id ? 'rgba(255,255,255,0.2)' : '#F0F2F5', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr 80px 80px 70px 44px', padding: '10px 16px', background: '#F7F8FA', borderBottom: '1px solid #E8ECF0' }}>
          {['Article', 'Catégorie', 'Utilisateur', 'Stock', 'DLC', 'Statut', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#8694A7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Aucun résultat</div>
        ) : (
          filtered.map((item, i) => {
            const status = getStatus(item)
            const st = STATUS_STYLES[status]
            return (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr 80px 80px 70px 44px', padding: '10px 16px', borderBottom: i < filtered.length - 1 ? '1px solid #F0F2F5' : 'none', background: status === 'danger' ? '#FFF9F9' : status === 'warning' ? '#FFFDF5' : i % 2 === 0 ? '#fff' : '#FAFAFA', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1E3D' }}>{item.name}</span>
                <span style={{ fontSize: 12, color: '#4A5568' }}>{item.category || '—'}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#0A1E3D' }}>{item.user?.name || '—'}</div>
                  <div style={{ fontSize: 10, color: '#8694A7' }}>{item.user?.email || '—'}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: st.color }}>
                  {item.quantity}<span style={{ fontSize: 10, color: '#8694A7', fontWeight: 400 }}>/{item.max_quantity || '—'}</span>
                </span>
                <span style={{ fontSize: 11, color: '#8694A7', fontFamily: 'monospace' }}>{formatDLC(item.dlc)}</span>
                <div>
                  {status !== 'ok' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IcoAlert color={st.color} />
                      <Badge label={st.label} color={st.color} bg={st.bg} />
                    </div>
                  )}
                  {status === 'ok' && <Badge label="OK" color="#1D8348" bg="#E6F2EC" />}
                </div>
                <button onClick={() => setSelected(item)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #BFDBFE', background: '#EFF6FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IcoEye />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}