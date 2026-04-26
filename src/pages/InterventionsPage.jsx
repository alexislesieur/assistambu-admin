import { useEffect, useState } from 'react'
import { interventionsApi } from '../lib/api'

const IcoSearch = ({ color = '#8694A7' }) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcoX      = ({ color = '#4A5568' }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcoEye    = ({ color = '#2E86C1' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>

const CATEGORIES = {
  cardio:    { color: '#C0392B', bg: '#FEF2F2', label: 'Cardio' },
  respi:     { color: '#2E86C1', bg: '#E3F0FA', label: 'Respi' },
  trauma:    { color: '#D4860B', bg: '#FBF1E0', label: 'Trauma' },
  neuro:     { color: '#8E44AD', bg: '#F0E6F6', label: 'Neuro' },
  pedia:     { color: '#1D8348', bg: '#E6F2EC', label: 'Pédia' },
  obstétrie: { color: '#E91E8C', bg: '#FCE4F5', label: 'Obstétrie' },
  psych:     { color: '#5D6D7E', bg: '#EAF0F6', label: 'Psychiatrie' },
  general:   { color: '#4A5568', bg: '#F0F2F5', label: 'Général' },
}

function Badge({ label, color, bg }) {
  return <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, borderRadius: 6, padding: '2px 8px' }}>{label}</span>
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function IntervModal({ interv, onClose }) {
  const cat = CATEGORIES[interv.category] || CATEGORIES.general

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A1E3D' }}>Détail intervention</h2>
          <button onClick={onClose} style={{ background: '#F0F2F5', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcoX /></button>
        </div>

        {/* Catégorie */}
        <div style={{ background: cat.bg, borderRadius: 12, padding: '12px 16px', marginBottom: 16, borderLeft: `4px solid ${cat.color}` }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: cat.color, textTransform: 'capitalize' }}>{cat.label}</span>
        </div>

        {/* User */}
        <div style={{ background: '#F7F8FA', borderRadius: 10, padding: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0A1E3D' }}>{interv.shift?.user?.name || '—'}</div>
          <div style={{ fontSize: 11, color: '#8694A7' }}>{interv.shift?.user?.email || '—'}</div>
        </div>

        {/* Infos */}
        {[
          { label: 'ID',          value: `#${interv.id}` },
          { label: 'Date',        value: formatDate(interv.created_at) },
          { label: 'Patient',     value: `${interv.patient_gender === 'M' ? '♂ Homme' : '♀ Femme'} · ${interv.patient_age} ans` },
          { label: 'Transport',   value: { outbound: 'Aller', return: 'Retour', round_trip: 'Aller-retour', none: 'Non concerné' }[interv.driving] || '—' },
          { label: 'Sans transport', value: interv.no_transport ? 'Oui' : 'Non' },
          { label: 'Garde',       value: `#${interv.shift_id}` },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F0F2F5' }}>
            <span style={{ fontSize: 12, color: '#8694A7' }}>{row.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1E3D' }}>{row.value}</span>
          </div>
        ))}

        {/* Gestes */}
        {interv.gestures?.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8694A7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Gestes réalisés</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {interv.gestures.map((g, i) => (
                <span key={i} style={{ fontSize: 11, background: '#F0F2F5', color: '#4A5568', borderRadius: 6, padding: '3px 8px', fontWeight: 500 }}>{g}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState([])
  const [loading, setLoading]             = useState(true)
  const [search, setSearch]               = useState('')
  const [filter, setFilter]               = useState('all')
  const [selected, setSelected]           = useState(null)

  useEffect(() => {
    interventionsApi.index().then(setInterventions).finally(() => setLoading(false))
  }, [])

  const filtered = interventions.filter(i => {
    const matchSearch = !search
      || i.category?.toLowerCase().includes(search.toLowerCase())
      || i.shift?.user?.name?.toLowerCase().includes(search.toLowerCase())
      || i.shift?.user?.email?.toLowerCase().includes(search.toLowerCase())
    if (filter !== 'all') return matchSearch && i.category === filter
    return matchSearch
  })

  const categories = [...new Set(interventions.map(i => i.category).filter(Boolean))]

  return (
    <div style={{ padding: 32 }}>
      {selected && <IntervModal interv={selected} onClose={() => setSelected(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1E3D', letterSpacing: '-0.03em', marginBottom: 3 }}>Interventions</h1>
          <p style={{ fontSize: 12, color: '#8694A7' }}>{interventions.length} intervention{interventions.length > 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 12px', height: 36 }}>
          <IcoSearch />
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1C1F26', background: 'transparent', width: 200 }} />
        </div>
      </div>

      {/* Filtres catégories */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', background: filter === 'all' ? '#0A1E3D' : '#fff', color: filter === 'all' ? '#fff' : '#4A5568', fontSize: 12, fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          Toutes ({interventions.length})
        </button>
        {categories.map(cat => {
          const style = CATEGORIES[cat] || CATEGORIES.general
          const count = interventions.filter(i => i.category === cat).length
          return (
            <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', background: filter === cat ? style.color : '#fff', color: filter === cat ? '#fff' : style.color, fontSize: 12, fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
              {style.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Tableau */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 100px 140px 80px 50px', padding: '10px 16px', background: '#F7F8FA', borderBottom: '1px solid #E8ECF0' }}>
          {['Catégorie', 'Utilisateur', 'Patient', 'Date', 'Gestes', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#8694A7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Aucun résultat</div>
        ) : (
          filtered.map((interv, i) => {
            const cat = CATEGORIES[interv.category] || CATEGORIES.general
            return (
              <div key={interv.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 100px 140px 80px 50px', padding: '11px 16px', borderBottom: i < filtered.length - 1 ? '1px solid #F0F2F5' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAFA', alignItems: 'center' }}>
                <div><Badge label={cat.label} color={cat.color} bg={cat.bg} /></div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0A1E3D' }}>{interv.shift?.user?.name || '—'}</div>
                  <div style={{ fontSize: 11, color: '#8694A7' }}>{interv.shift?.user?.email || '—'}</div>
                </div>
                <span style={{ fontSize: 12, color: '#4A5568' }}>
                  {interv.patient_gender === 'M' ? '♂' : '♀'} {interv.patient_age} ans
                </span>
                <span style={{ fontSize: 11, color: '#8694A7', fontFamily: 'monospace' }}>
                  {new Date(interv.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span style={{ fontSize: 12, color: '#8694A7' }}>
                  {interv.gestures?.length > 0 ? `${interv.gestures.length} geste${interv.gestures.length > 1 ? 's' : ''}` : '—'}
                </span>
                <button onClick={() => setSelected(interv)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #BFDBFE', background: '#EFF6FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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