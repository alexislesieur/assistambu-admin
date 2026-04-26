import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

const LEVEL_STYLES = {
  info:    { color: '#2E86C1', bg: '#E3F0FA', label: 'Info' },
  warning: { color: '#D4860B', bg: '#FBF1E0', label: 'Attention' },
  danger:  { color: '#C0392B', bg: '#FEF2F2', label: 'Danger' },
}

// Icônes SVG inline
const IcoLogin      = ({ color = '#2E86C1' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
const IcoLogout     = ({ color = '#8694A7' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IcoRegister   = ({ color = '#1D8348' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
const IcoMail       = ({ color = '#2E86C1' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const IcoKey        = ({ color = '#D4860B' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
const IcoShiftStart = ({ color = '#1D8348' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IcoShiftEnd   = ({ color = '#C0392B' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
const IcoPulse      = ({ color = '#8E44AD' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
const IcoTrash      = ({ color = '#C0392B' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
const IcoBox        = ({ color = '#2E86C1' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
const IcoRestock    = ({ color = '#1D8348' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
const IcoLock       = ({ color = '#C0392B' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
const IcoUnlock     = ({ color = '#1D8348' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>
const IcoUserX      = ({ color = '#C0392B' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
const IcoSearch     = ({ color = '#8694A7' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcoEye        = ({ color = '#2E86C1' }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IcoRefresh    = ({ color = '#4A5568' }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>

const ACTION_LABELS = {
  'auth.login':            { label: 'Connexion',              Icon: IcoLogin      },
  'auth.logout':           { label: 'Déconnexion',            Icon: IcoLogout     },
  'auth.register':         { label: 'Inscription',            Icon: IcoRegister   },
  'auth.email_verified':   { label: 'Email vérifié',          Icon: IcoMail       },
  'auth.password_reset':   { label: 'Reset mot de passe',     Icon: IcoKey        },
  'shift.start':           { label: 'Début de garde',         Icon: IcoShiftStart },
  'shift.end':             { label: 'Fin de garde',           Icon: IcoShiftEnd   },
  'intervention.create':   { label: 'Intervention créée',     Icon: IcoPulse      },
  'intervention.delete':   { label: 'Intervention supprimée', Icon: IcoTrash      },
  'item.create':           { label: 'Article créé',           Icon: IcoBox        },
  'item.restock':          { label: 'Réassort article',       Icon: IcoRestock    },
  'item.delete':           { label: 'Article supprimé',       Icon: IcoTrash      },
  'admin.user_blocked':    { label: 'Compte bloqué',          Icon: IcoLock       },
  'admin.user_unblocked':  { label: 'Compte débloqué',        Icon: IcoUnlock     },
  'admin.user_deleted':    { label: 'Compte supprimé',        Icon: IcoUserX      },
  'admin.password_reset':  { label: 'Reset MDP (admin)',      Icon: IcoKey        },
}

function Badge({ label, color, bg }) {
  return <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, borderRadius: 6, padding: '2px 8px' }}>{label}</span>
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function LogModal({ log, onClose }) {
  const levelStyle  = LEVEL_STYLES[log.level] || LEVEL_STYLES.info
  const actionLabel = ACTION_LABELS[log.action] || { label: log.action, Icon: IcoBox }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 520, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: levelStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <actionLabel.Icon color={levelStyle.color} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0A1E3D' }}>{actionLabel.label}</h2>
          </div>
          <button onClick={onClose} style={{ background: '#F0F2F5', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#4A5568' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: 'ID',          value: `#${log.id}` },
            { label: 'Action',      value: log.action },
            { label: 'Niveau',      value: <Badge label={levelStyle.label} color={levelStyle.color} bg={levelStyle.bg} /> },
            { label: 'Utilisateur', value: log.user ? log.user.email : 'Système' },
            { label: 'Entité',      value: log.entity_type ? `${log.entity_type} #${log.entity_id}` : '—' },
            { label: 'IP',          value: log.ip || '—' },
            { label: 'User Agent',  value: log.user_agent || '—' },
            { label: 'Date',        value: formatDate(log.created_at) },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid #F0F2F5', gap: 16 }}>
              <span style={{ fontSize: 12, color: '#8694A7', flexShrink: 0, width: 100 }}>{row.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1E3D', textAlign: 'right', wordBreak: 'break-all' }}>{row.value}</span>
            </div>
          ))}

          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8694A7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Métadonnées</div>
              <div style={{ background: '#F7F8FA', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 12, color: '#0A1E3D', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(log.metadata, null, 2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LogsPage() {
  const [logs, setLogs]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [selectedLog, setSelectedLog] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (levelFilter !== 'all') params.append('level', levelFilter)
    if (actionFilter !== 'all') params.append('action', actionFilter)
    api.get(`/admin/logs?${params.toString()}`)
      .then(setLogs)
      .finally(() => setLoading(false))
  }, [levelFilter, actionFilter])

  useEffect(() => { load() }, [load])

  const filtered = logs.filter(l => {
    if (!search) return true
    const label = ACTION_LABELS[l.action]?.label || l.action
    return (
      label.toLowerCase().includes(search.toLowerCase()) ||
      l.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.ip?.includes(search)
    )
  })

  const ACTION_GROUPS = [
    { id: 'all',          label: 'Toutes' },
    { id: 'auth',         label: 'Auth' },
    { id: 'shift',        label: 'Gardes' },
    { id: 'intervention', label: 'Interventions' },
    { id: 'item',         label: 'Sac' },
    { id: 'admin',        label: 'Admin' },
  ]

  const LEVELS = [
    { id: 'all',     label: 'Tous',      color: '#4A5568' },
    { id: 'info',    label: 'Info',      color: '#2E86C1' },
    { id: 'warning', label: 'Attention', color: '#D4860B' },
    { id: 'danger',  label: 'Danger',    color: '#C0392B' },
  ]

  return (
    <div style={{ padding: 32 }}>

      {selectedLog && <LogModal log={selectedLog} onClose={() => setSelectedLog(null)} />}

      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1E3D', letterSpacing: '-0.03em', marginBottom: 3 }}>Logs</h1>
          <p style={{ fontSize: 12, color: '#8694A7' }}>{filtered.length} entrée{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 12px', height: 36 }}>
            <IcoSearch />
            <input
              type="text" placeholder="Rechercher..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1C1F26', background: 'transparent', width: 160 }}
            />
          </div>
          <button onClick={load} style={{ height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid #E8ECF0', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#4A5568', display: 'flex', alignItems: 'center', gap: 6 }}>
            <IcoRefresh /> Actualiser
          </button>
        </div>
      </div>

      {/* Filtres niveau */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        {LEVELS.map(l => (
          <button key={l.id} onClick={() => setLevelFilter(l.id)} style={{
            padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: levelFilter === l.id ? '#0A1E3D' : '#fff',
            color: levelFilter === l.id ? '#fff' : l.color,
            fontSize: 12, fontWeight: 600,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}>
            {l.label}
          </button>
        ))}
      </div>

      {/* Filtres action */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {ACTION_GROUPS.map(a => (
          <button key={a.id} onClick={() => setActionFilter(a.id)} style={{
            padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: actionFilter === a.id ? '#2E86C1' : '#fff',
            color: actionFilter === a.id ? '#fff' : '#4A5568',
            fontSize: 12, fontWeight: 600,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '36px 160px 160px 1fr 110px 44px', padding: '10px 16px', background: '#F7F8FA', borderBottom: '1px solid #E8ECF0' }}>
          {['', 'Date', 'Utilisateur', 'Action', 'Niveau', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#8694A7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Aucun log</div>
        ) : (
          filtered.map((log, i) => {
            const levelStyle  = LEVEL_STYLES[log.level] || LEVEL_STYLES.info
            const actionLabel = ACTION_LABELS[log.action] || { label: log.action, Icon: IcoBox }
            const ActionIcon  = actionLabel.Icon
            return (
              <div key={log.id} style={{
                display: 'grid', gridTemplateColumns: '36px 160px 160px 1fr 110px 44px',
                padding: '10px 16px',
                borderBottom: i < filtered.length - 1 ? '1px solid #F0F2F5' : 'none',
                background: log.level === 'danger' ? '#FFF9F9' : log.level === 'warning' ? '#FFFDF5' : i % 2 === 0 ? '#fff' : '#FAFAFA',
                alignItems: 'center',
              }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: levelStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ActionIcon color={levelStyle.color} />
                </div>
                <span style={{ fontSize: 11, color: '#8694A7', fontFamily: 'monospace' }}>
                  {formatDate(log.created_at)}
                </span>
                <span style={{ fontSize: 12, color: '#4A5568', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.user ? log.user.email : <span style={{ color: '#B0BFCC', fontStyle: 'italic' }}>Système</span>}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1E3D' }}>{actionLabel.label}</span>
                <div><Badge label={levelStyle.label} color={levelStyle.color} bg={levelStyle.bg} /></div>
                <button
                  onClick={() => setSelectedLog(log)}
                  style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #BFDBFE', background: '#EFF6FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
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