import { useEffect, useState } from 'react'
import { shiftsApi } from '../lib/api'

const IcoSearch = ({ color = '#8694A7' }) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcoX      = ({ color = '#4A5568' }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcoEye    = ({ color = '#2E86C1' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatAmplitude(start, end) {
  if (!end) return null
  const diff = Math.floor((new Date(end) - new Date(start)) / 60000)
  const h = Math.floor(diff / 60)
  const m = diff % 60
  return `${h}h${String(m).padStart(2, '0')}`
}

function ShiftModal({ shift, onClose }) {
  const amplitude = shift.ended_at ? formatAmplitude(shift.started_at, shift.ended_at) : null
  const tte = shift.ended_at
    ? (() => {
        const diff = Math.floor((new Date(shift.ended_at) - new Date(shift.started_at)) / 60000) - (shift.break_minutes || 0)
        return `${Math.floor(diff / 60)}h${String(diff % 60).padStart(2, '0')}`
      })()
    : null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A1E3D' }}>Détail de la garde</h2>
          <button onClick={onClose} style={{ background: '#F0F2F5', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcoX /></button>
        </div>

        {/* User */}
        <div style={{ background: '#F7F8FA', borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0A1E3D' }}>{shift.user?.name || '—'}</div>
          <div style={{ fontSize: 12, color: '#8694A7' }}>{shift.user?.email || '—'}</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Amplitude',  value: amplitude || '—' },
            { label: 'TTE',        value: tte || '—' },
            { label: 'Pause',      value: `${shift.break_minutes || 0}min` },
          ].map((s, i) => (
            <div key={i} style={{ background: '#F7F8FA', borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0A1E3D' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#8694A7', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Infos */}
        {[
          { label: 'ID',         value: `#${shift.id}` },
          { label: 'Rôle',       value: shift.driver ? 'Conducteur' : 'Équipier' },
          { label: 'Début',      value: formatDate(shift.started_at) },
          { label: 'Fin',        value: shift.ended_at ? formatDate(shift.ended_at) : <span style={{ color: '#2ECC71', fontWeight: 700 }}>En cours</span> },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F0F2F5' }}>
            <span style={{ fontSize: 12, color: '#8694A7' }}>{row.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1E3D' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ShiftsPage() {
  const [shifts, setShifts]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    shiftsApi.index().then(setShifts).finally(() => setLoading(false))
  }, [])

  const filtered = shifts.filter(s => {
    const matchSearch = !search || s.user?.name?.toLowerCase().includes(search.toLowerCase()) || s.user?.email?.toLowerCase().includes(search.toLowerCase())
    if (filter === 'active') return matchSearch && !s.ended_at
    if (filter === 'ended')  return matchSearch && !!s.ended_at
    return matchSearch
  })

  const activeCount = shifts.filter(s => !s.ended_at).length

  const FILTERS = [
    { id: 'all',    label: 'Toutes',      count: shifts.length },
    { id: 'active', label: 'En cours',    count: activeCount },
    { id: 'ended',  label: 'Terminées',   count: shifts.length - activeCount },
  ]

  return (
    <div style={{ padding: 32 }}>
      {selected && <ShiftModal shift={selected} onClose={() => setSelected(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1E3D', letterSpacing: '-0.03em', marginBottom: 3 }}>Gardes</h1>
          <p style={{ fontSize: 12, color: '#8694A7' }}>{shifts.length} garde{shifts.length > 1 ? 's' : ''} · <span style={{ color: '#1D8348', fontWeight: 700 }}>{activeCount} en cours</span></p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 12px', height: 36 }}>
          <IcoSearch />
          <input type="text" placeholder="Rechercher un utilisateur..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1C1F26', background: 'transparent', width: 220 }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', background: filter === f.id ? '#0A1E3D' : '#fff', color: filter === f.id ? '#fff' : '#4A5568', fontSize: 12, fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            {f.label}
            <span style={{ background: filter === f.id ? 'rgba(255,255,255,0.2)' : '#F0F2F5', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{f.count}</span>
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px 100px 80px 50px', padding: '10px 16px', background: '#F7F8FA', borderBottom: '1px solid #E8ECF0' }}>
          {['Utilisateur', 'Email', 'Début', 'Fin', 'Rôle', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#8694A7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Aucun résultat</div>
        ) : (
          filtered.map((shift, i) => (
            <div key={shift.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px 100px 80px 50px', padding: '11px 16px', borderBottom: i < filtered.length - 1 ? '1px solid #F0F2F5' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAFA', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1E3D' }}>{shift.user?.name || '—'}</span>
              <span style={{ fontSize: 12, color: '#4A5568' }}>{shift.user?.email || '—'}</span>
              <span style={{ fontSize: 11, color: '#8694A7', fontFamily: 'monospace' }}>{new Date(shift.started_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
              <div>
                {shift.ended_at
                  ? <span style={{ fontSize: 11, color: '#8694A7', fontFamily: 'monospace' }}>{new Date(shift.ended_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                  : <span style={{ fontSize: 10, fontWeight: 700, color: '#1D8348', background: '#E6F2EC', borderRadius: 6, padding: '2px 8px' }}>En cours</span>
                }
              </div>
              <span style={{ fontSize: 12, color: '#4A5568' }}>{shift.driver ? 'Conducteur' : 'Équipier'}</span>
              <button onClick={() => setSelected(shift)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #BFDBFE', background: '#EFF6FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcoEye />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}