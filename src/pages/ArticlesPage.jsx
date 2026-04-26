import { useEffect, useState } from 'react'
import { api } from '../lib/api'

const IcoPlus   = ({ color = '#fff' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IcoEdit   = ({ color = '#2E86C1' }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IcoTrash  = ({ color = '#C0392B' }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
const IcoX      = ({ color = '#4A5568' }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcoCheck  = ({ color = '#fff' })   => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>

const inputStyle = { width: '100%', height: 42, border: '1.5px solid #D1D8E0', borderRadius: 8, padding: '0 12px', fontSize: 13, color: '#1C1F26', background: '#F7F8FA', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans',sans-serif" }

const DEFAULT_CATEGORIES = ['Airway', 'Breathing', 'Circulation', 'Médicaments', 'Immobilisation', 'Divers']

function ArticleModal({ article, onClose, onSave, loading }) {
  const [name, setName]           = useState(article?.name || '')
  const [category, setCategory]   = useState(article?.category || '')
  const [maxQty, setMaxQty]       = useState(article?.max_quantity || '')
  const [customCat, setCustomCat] = useState(!DEFAULT_CATEGORIES.includes(article?.category || ''))

  const isEdit = !!article

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A1E3D' }}>{isEdit ? 'Modifier' : 'Ajouter'} un article</h2>
          <button onClick={onClose} style={{ background: '#F0F2F5', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcoX /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Nom *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Seringue 10mL" style={inputStyle} />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Catégorie *</label>
            {!customCat ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                  <option value="">Choisir...</option>
                  {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => setCustomCat(true)} style={{ padding: '0 12px', borderRadius: 8, border: '1px solid #E8ECF0', background: '#F7F8FA', fontSize: 12, color: '#4A5568', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Autre
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Catégorie personnalisée" style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => { setCustomCat(false); setCategory('') }} style={{ padding: '0 12px', borderRadius: 8, border: '1px solid #E8ECF0', background: '#F7F8FA', fontSize: 12, color: '#4A5568', cursor: 'pointer' }}>
                  ←
                </button>
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Quantité recommandée</label>
            <input type="number" value={maxQty} onChange={e => setMaxQty(e.target.value)} placeholder="Ex: 5" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, height: 42, borderRadius: 8, border: '1px solid #E8ECF0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#4A5568', cursor: 'pointer' }}>Annuler</button>
          <button
            onClick={() => onSave({ name, category, max_quantity: parseInt(maxQty) || null })}
            disabled={!name || !category || loading}
            style={{ flex: 2, height: 42, borderRadius: 8, border: 'none', background: !name || !category ? '#CBD5E0' : '#0A1E3D', fontSize: 13, fontWeight: 700, color: '#fff', cursor: !name || !category ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
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
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0A1E3D', marginBottom: 8 }}>Supprimer l'article</h3>
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

export default function ArticlesPage() {
  const [articles, setArticles]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(null)
  const [toDelete, setToDelete]   = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast]         = useState(null)
  const [search, setSearch]       = useState('')
  const [catFilter, setCatFilter] = useState('all')

  const load = () => api.get('/admin/items').then(setArticles).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const handleSave = async (data) => {
    setActionLoading(true)
    try {
      if (modal === 'add') {
        const a = await api.post('/items', { ...data, quantity: 0 })
        setArticles(prev => [a, ...prev])
        showToast('Article ajouté.')
      } else {
        const a = await api.put(`/items/${modal.id}`, data)
        setArticles(prev => prev.map(x => x.id === a.id ? a : x))
        showToast('Article modifié.')
      }
      setModal(null)
    } catch { showToast('Erreur.', 'error') }
    finally { setActionLoading(false) }
  }

  const handleDelete = async () => {
    setActionLoading(true)
    try {
      await api.delete(`/items/${toDelete.id}`)
      setArticles(prev => prev.filter(a => a.id !== toDelete.id))
      setToDelete(null)
      showToast('Article supprimé.')
    } catch { showToast('Erreur.', 'error') }
    finally { setActionLoading(false) }
  }

  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))]

  const filtered = articles.filter(a => {
    const matchSearch = !search || a.name?.toLowerCase().includes(search.toLowerCase())
    const matchCat    = catFilter === 'all' || a.category === catFilter
    return matchSearch && matchCat
  })

  // Grouper par catégorie
  const grouped = filtered.reduce((acc, a) => {
    const cat = a.category || 'Autres'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(a)
    return acc
  }, {})

  return (
    <div style={{ padding: 32 }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000, background: toast.type === 'error' ? '#C0392B' : '#1D8348', color: '#fff', borderRadius: 10, padding: '12px 18px', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>{toast.msg}</div>
      )}

      {modal && <ArticleModal article={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} loading={actionLoading} />}
      {toDelete && <ConfirmModal message={`Supprimer "${toDelete.name}" ? Cette action est irréversible.`} onConfirm={handleDelete} onCancel={() => setToDelete(null)} loading={actionLoading} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1E3D', letterSpacing: '-0.03em', marginBottom: 3 }}>Articles du sac</h1>
          <p style={{ fontSize: 12, color: '#8694A7' }}>{articles.length} article{articles.length > 1 ? 's' : ''} · {categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 12px', height: 36 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8694A7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 13, background: 'transparent', width: 160 }} />
          </div>
          <button onClick={() => setModal('add')} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 8, border: 'none', background: '#0A1E3D', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            <IcoPlus /> Ajouter
          </button>
        </div>
      </div>

      {/* Filtres catégories */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={() => setCatFilter('all')} style={{ padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', background: catFilter === 'all' ? '#0A1E3D' : '#fff', color: catFilter === 'all' ? '#fff' : '#4A5568', fontSize: 12, fontWeight: 600 }}>
          Toutes ({articles.length})
        </button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat)} style={{ padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', background: catFilter === cat ? '#2E86C1' : '#fff', color: catFilter === cat ? '#fff' : '#4A5568', fontSize: 12, fontWeight: 600 }}>
            {cat} ({articles.filter(a => a.category === cat).length})
          </button>
        ))}
      </div>

      {/* Groupes */}
      {loading ? (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF0', padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Chargement...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF0', padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Aucun article</div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF0', overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ padding: '10px 16px', background: '#F7F8FA', borderBottom: '1px solid #E8ECF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0A1E3D' }}>{cat}</span>
              <span style={{ fontSize: 11, color: '#8694A7' }}>{items.length} article{items.length > 1 ? 's' : ''}</span>
            </div>
            {items.map((article, i) => (
              <div key={article.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: i < items.length - 1 ? '1px solid #F0F2F5' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAFA', gap: 12 }}>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#0A1E3D' }}>{article.name}</span>
                <span style={{ fontSize: 12, color: '#8694A7' }}>Qté max : {article.max_quantity || '—'}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setModal(article)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #BFDBFE', background: '#EFF6FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IcoEdit />
                  </button>
                  <button onClick={() => setToDelete(article)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #FECACA', background: '#FEF2F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IcoTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}