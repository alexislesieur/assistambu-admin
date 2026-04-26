import { useEffect, useState } from 'react'
import { hospitalsApi } from '../lib/api'

const IcoPlus   = ({ color = '#fff' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IcoEdit   = ({ color = '#2E86C1' }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IcoTrash  = ({ color = '#C0392B' }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
const IcoX      = ({ color = '#4A5568' }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcoCheck  = ({ color = '#fff' })   => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>

const inputStyle = { width: '100%', height: 42, border: '1.5px solid #D1D8E0', borderRadius: 8, padding: '0 12px', fontSize: 13, color: '#1C1F26', background: '#F7F8FA', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans',sans-serif" }

function HospitalModal({ hospital, onClose, onSave, loading }) {
  const [name, setName]     = useState(hospital?.name || '')
  const [city, setCity]     = useState(hospital?.city || '')
  const [address, setAddress] = useState(hospital?.address || '')
  const [phone, setPhone]   = useState(hospital?.phone || '')

  const isEdit = !!hospital

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A1E3D' }}>{isEdit ? 'Modifier' : 'Ajouter'} un hôpital</h2>
          <button onClick={onClose} style={{ background: '#F0F2F5', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcoX /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Nom *',     value: name,    setter: setName,    placeholder: 'CHU de Lille' },
            { label: 'Ville *',   value: city,    setter: setCity,    placeholder: 'Lille' },
            { label: 'Adresse',   value: address, setter: setAddress, placeholder: 'Rue du Professeur Laguesse' },
            { label: 'Téléphone', value: phone,   setter: setPhone,   placeholder: '03 20 44 59 62' },
          ].map((field, i) => (
            <div key={i}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>{field.label}</label>
              <input value={field.value} onChange={e => field.setter(e.target.value)} placeholder={field.placeholder} style={inputStyle} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, height: 42, borderRadius: 8, border: '1px solid #E8ECF0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#4A5568', cursor: 'pointer' }}>Annuler</button>
          <button
            onClick={() => onSave({ name, city, address, phone })}
            disabled={!name || !city || loading}
            style={{ flex: 2, height: 42, borderRadius: 8, border: 'none', background: !name || !city ? '#CBD5E0' : '#0A1E3D', fontSize: 13, fontWeight: 700, color: '#fff', cursor: !name || !city ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            {loading ? 'Enregistrement...' : <><IcoCheck />{isEdit ? 'Modifier' : 'Ajouter'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 360, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0A1E3D', marginBottom: 8 }}>Supprimer l'hôpital</h3>
        <p style={{ fontSize: 13, color: '#8694A7', marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, height: 40, borderRadius: 8, border: '1px solid #E8ECF0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#4A5568', cursor: 'pointer' }}>Annuler</button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 1, height: 40, borderRadius: 8, border: 'none', background: '#C0392B', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(null) // null | 'add' | hospital
  const [toDelete, setToDelete]   = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast]         = useState(null)
  const [search, setSearch]       = useState('')

  const load = () => hospitalsApi.index().then(setHospitals).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const handleSave = async (data) => {
    setActionLoading(true)
    try {
      if (modal === 'add') {
        const h = await hospitalsApi.store(data)
        setHospitals(prev => [h, ...prev])
        showToast('Hôpital ajouté.')
      } else {
        const h = await hospitalsApi.update(modal.id, data)
        setHospitals(prev => prev.map(x => x.id === h.id ? h : x))
        showToast('Hôpital modifié.')
      }
      setModal(null)
    } catch { showToast('Erreur lors de l\'enregistrement.', 'error') }
    finally { setActionLoading(false) }
  }

  const handleDelete = async () => {
    setActionLoading(true)
    try {
      await hospitalsApi.destroy(toDelete.id)
      setHospitals(prev => prev.filter(h => h.id !== toDelete.id))
      setToDelete(null)
      showToast('Hôpital supprimé.')
    } catch { showToast('Erreur lors de la suppression.', 'error') }
    finally { setActionLoading(false) }
  }

  const filtered = hospitals.filter(h =>
    !search || h.name?.toLowerCase().includes(search.toLowerCase()) || h.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: 32 }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000, background: toast.type === 'error' ? '#C0392B' : '#1D8348', color: '#fff', borderRadius: 10, padding: '12px 18px', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>{toast.msg}</div>
      )}

      {modal && <HospitalModal hospital={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} loading={actionLoading} />}
      {toDelete && <ConfirmModal message={`Supprimer "${toDelete.name}" ? Cette action est irréversible.`} onConfirm={handleDelete} onCancel={() => setToDelete(null)} loading={actionLoading} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1E3D', letterSpacing: '-0.03em', marginBottom: 3 }}>Hôpitaux</h1>
          <p style={{ fontSize: 12, color: '#8694A7' }}>{hospitals.length} hôpital{hospitals.length > 1 ? 'ux' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 12px', height: 36 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8694A7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1C1F26', background: 'transparent', width: 160 }} />
          </div>
          <button onClick={() => setModal('add')} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 8, border: 'none', background: '#0A1E3D', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            <IcoPlus /> Ajouter
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr 120px 80px', padding: '10px 16px', background: '#F7F8FA', borderBottom: '1px solid #E8ECF0' }}>
          {['Nom', 'Ville', 'Adresse', 'Téléphone', 'Actions'].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#8694A7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Aucun hôpital — ajoutez-en un !</div>
        ) : (
          filtered.map((h, i) => (
            <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr 120px 80px', padding: '11px 16px', borderBottom: i < filtered.length - 1 ? '1px solid #F0F2F5' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAFA', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1E3D' }}>{h.name}</span>
              <span style={{ fontSize: 12, color: '#4A5568' }}>{h.city || '—'}</span>
              <span style={{ fontSize: 12, color: '#8694A7' }}>{h.address || '—'}</span>
              <span style={{ fontSize: 12, color: '#8694A7' }}>{h.phone || '—'}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setModal(h)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #BFDBFE', background: '#EFF6FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IcoEdit />
                </button>
                <button onClick={() => setToDelete(h)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #FECACA', background: '#FEF2F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IcoTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}