import { useEffect, useState } from 'react'
import { waitlistApi, api } from '../lib/api'

// Modale de confirmation custom
function ConfirmModal({ email, onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 28, maxWidth: 400, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        {/* Icône */}
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: '#FEF2F2', border: '2px solid #FECACA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0A1E3D', textAlign: 'center', marginBottom: 8 }}>
          Supprimer de la waitlist
        </h3>
        <p style={{ fontSize: 13, color: '#8694A7', textAlign: 'center', marginBottom: 6 }}>
          Êtes-vous sûr de vouloir supprimer
        </p>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1E3D', textAlign: 'center', marginBottom: 24 }}>
          {email}
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1, height: 40, borderRadius: 8,
              border: '1px solid #E8ECF0', background: '#fff',
              fontSize: 13, fontWeight: 600, color: '#4A5568',
              cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, height: 40, borderRadius: 8,
              border: 'none', background: '#C0392B',
              fontSize: 13, fontWeight: 700, color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WaitlistPage() {
  const [list, setList]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [newEmail, setNewEmail]     = useState('')
  const [adding, setAdding]         = useState(false)
  const [addError, setAddError]     = useState(null)
  const [toDelete, setToDelete]     = useState(null) // { id, email }
  const [deleting, setDeleting]     = useState(false)

  const load = () => {
    waitlistApi.index()
      .then(setList)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = list.filter(i => i.email.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = async () => {
    if (!newEmail) return
    setAddError(null)
    setAdding(true)
    try {
      await api.post('/waitlist/admin', { email: newEmail })
      setNewEmail('')
      load()
    } catch (err) {
      const errors = err.errors?.errors
      if (errors?.email) setAddError(errors.email[0])
      else setAddError(err.errors?.message || 'Une erreur est survenue.')
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await api.delete(`/waitlist/${toDelete.id}`)
      setList(l => l.filter(i => i.id !== toDelete.id))
      setToDelete(null)
    } catch {
      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div style={{ padding: 32 }}>

      {/* Modale confirmation */}
      {toDelete && (
        <ConfirmModal
          email={toDelete.email}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setToDelete(null)}
          loading={deleting}
        />
      )}

      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1E3D', letterSpacing: '-0.03em', marginBottom: 3 }}>Waitlist</h1>
          <p style={{ fontSize: 12, color: '#8694A7' }}>{list.length} inscrit{list.length > 1 ? 's' : ''}</p>
        </div>
        <input
          type="text"
          placeholder="Rechercher un email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            height: 36, border: '1px solid #E8ECF0', borderRadius: 8,
            padding: '0 12px', fontSize: 13, color: '#1C1F26',
            background: '#fff', outline: 'none', width: 240,
          }}
        />
      </div>

      {/* Formulaire ajout */}
      <div style={{
        background: '#fff', borderRadius: 14, border: '1px solid #E8ECF0',
        padding: '16px 20px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1E3D', whiteSpace: 'nowrap' }}>Ajouter manuellement</span>
        <input
          type="email"
          placeholder="email@exemple.fr"
          value={newEmail}
          onChange={e => { setNewEmail(e.target.value); setAddError(null) }}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          style={{
            flex: 1, minWidth: 200, height: 36,
            border: `1px solid ${addError ? '#FECACA' : '#E8ECF0'}`,
            borderRadius: 8, padding: '0 12px', fontSize: 13,
            color: '#1C1F26', background: addError ? '#FEF2F2' : '#F7F8FA', outline: 'none',
          }}
        />
        {addError && <span style={{ fontSize: 12, color: '#C0392B' }}>{addError}</span>}
        <button
          onClick={handleAdd}
          disabled={adding || !newEmail}
          style={{
            height: 36, padding: '0 16px', borderRadius: 8, border: 'none',
            background: adding || !newEmail ? '#CBD5E0' : '#0A1E3D',
            color: '#fff', fontSize: 13, fontWeight: 700,
            cursor: adding || !newEmail ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {adding ? 'Ajout...' : '+ Ajouter'}
        </button>
      </div>

      {/* Tableau */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 180px 60px', padding: '10px 16px', background: '#F7F8FA', borderBottom: '1px solid #E8ECF0' }}>
          {['#', 'Email', 'Inscrit le', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#8694A7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Aucun résultat</div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'grid', gridTemplateColumns: '50px 1fr 180px 60px',
                padding: '10px 16px',
                borderBottom: i < filtered.length - 1 ? '1px solid #F0F2F5' : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFAFA',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, color: '#B0BFCC', fontWeight: 600 }}>{i + 1}</span>
              <span style={{ fontSize: 13, color: '#0A1E3D', fontWeight: 500 }}>{item.email}</span>
              <span style={{ fontSize: 12, color: '#8694A7' }}>
                {new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <button
                onClick={() => setToDelete({ id: item.id, email: item.email })}
                style={{
                  width: 28, height: 28, borderRadius: 6,
                  border: '1px solid #FECACA', background: '#FEF2F2',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title="Supprimer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}