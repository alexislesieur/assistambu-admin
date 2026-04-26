import { useEffect, useState } from 'react'
import { usersApi, api } from '../lib/api'
import { useAuth } from '../hooks/useAuth'

const IcoSearch  = ({ color = '#8694A7' }) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcoTrash   = ({ color = '#C0392B' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
const IcoLock    = ({ color = '#D4860B' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
const IcoUnlock  = ({ color = '#1D8348' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>
const IcoKey     = ({ color = '#2E86C1' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
const IcoEye     = ({ color = '#2E86C1' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IcoX       = ({ color = '#4A5568' }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcoCheck   = ({ color = '#fff' })    => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IcoInfo    = ({ color = '#B0BFCC' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const IcoShield  = ({ color = '#8E44AD' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>

const ROLE_STYLES = {
  superadmin: { label: 'Super Admin', color: '#8E44AD', bg: '#F0E6F6' },
  admin:      { label: 'Admin',       color: '#2E86C1', bg: '#E3F0FA' },
  beta:       { label: 'Bêta',        color: '#D4860B', bg: '#FBF1E0' },
  user:       { label: 'User',        color: '#4A5568', bg: '#F0F2F5' },
}

function Badge({ label, color, bg }) {
  return <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, borderRadius: 6, padding: '2px 8px', letterSpacing: '0.04em' }}>{label}</span>
}

function ActionBtn({ icon, label, color, bg, border, onClick, disabled, disabledReason }) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      title={disabled ? disabledReason : ''}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, border: disabled ? '1px solid #E8ECF0' : `1px solid ${border}`, background: disabled ? '#F7F8FA' : bg, cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, color: disabled ? '#B0BFCC' : color, width: '100%', opacity: disabled ? 0.6 : 1 }}
    >
      {icon}
      <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
      {disabled && <IcoInfo />}
    </button>
  )
}

function RoleSelector({ currentRole, onChange, isSuperAdmin }) {
  const availableRoles = isSuperAdmin
    ? ['user', 'beta', 'admin', 'superadmin']
    : ['user', 'beta']

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Rôle</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {['user', 'beta', 'admin', 'superadmin'].map(role => {
          const rs       = ROLE_STYLES[role]
          const canSelect = availableRoles.includes(role)
          const isActive  = currentRole === role
          return (
            <button
              key={role}
              onClick={() => canSelect && onChange(role)}
              disabled={!canSelect}
              style={{
                padding: '6px 12px', borderRadius: 20, border: `1.5px solid ${isActive ? rs.color : '#E8ECF0'}`,
                background: isActive ? rs.bg : '#fff', color: isActive ? rs.color : canSelect ? '#4A5568' : '#B0BFCC',
                fontWeight: isActive ? 700 : 500, fontSize: 12, cursor: canSelect ? 'pointer' : 'not-allowed',
                opacity: canSelect ? 1 : 0.5,
              }}
            >
              {rs.label}
            </button>
          )
        })}
      </div>
      {!isSuperAdmin && (
        <div style={{ fontSize: 11, color: '#B0BFCC', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          <IcoInfo /> Seul le super administrateur peut attribuer les rôles admin et superadmin
        </div>
      )}
    </div>
  )
}

function UserModal({ user, currentUser, onClose, onDelete, onToggleBlock, onResetPassword, onRoleChange, actionLoading }) {
  const isSuperAdmin = currentUser?.role === 'superadmin'
  const isSelf       = user.id === currentUser?.id
  const targetIsAdmin = ['admin', 'superadmin'].includes(user.role)
  const targetIsSuperAdmin = user.role === 'superadmin'

  const canDelete = !isSelf && !targetIsSuperAdmin && (isSuperAdmin || !targetIsAdmin)
  const canBlock  = !targetIsSuperAdmin && (isSuperAdmin || !targetIsAdmin)
  const canChangeRole = !isSelf && !targetIsSuperAdmin || (isSuperAdmin && !isSelf)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A1E3D' }}>Détail utilisateur</h2>
          <button onClick={onClose} style={{ background: '#F0F2F5', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcoX /></button>
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: 16, background: '#F7F8FA', borderRadius: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0A1E3D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0A1E3D', marginBottom: 4 }}>
              {user.name} {isSelf && <span style={{ fontSize: 11, color: '#8694A7' }}>(vous)</span>}
            </div>
            <div style={{ fontSize: 12, color: '#8694A7', marginBottom: 6 }}>{user.email}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Badge label={ROLE_STYLES[user.role]?.label || user.role} color={ROLE_STYLES[user.role]?.color} bg={ROLE_STYLES[user.role]?.bg} />
              {user.email_verified_at ? <Badge label="Vérifié" color="#1D8348" bg="#E6F2EC" /> : <Badge label="Non vérifié" color="#D4860B" bg="#FBF1E0" />}
              {user.blocked && <Badge label="Bloqué" color="#C0392B" bg="#FEF2F2" />}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <div style={{ background: '#F7F8FA', borderRadius: 10, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0A1E3D' }}>{user.shifts_count || 0}</div>
            <div style={{ fontSize: 11, color: '#8694A7', marginTop: 2 }}>Gardes</div>
          </div>
          <div style={{ background: '#F7F8FA', borderRadius: 10, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0A1E3D' }}>{user.interventions_count || 0}</div>
            <div style={{ fontSize: 11, color: '#8694A7', marginTop: 2 }}>Interventions</div>
          </div>
        </div>

        {/* Infos */}
        <div style={{ marginBottom: 20 }}>
          {[
            { label: 'ID',           value: `#${user.id}` },
            { label: 'Inscrit le',   value: new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Email vérifié', value: user.email_verified_at ? new Date(user.email_verified_at).toLocaleDateString('fr-FR') : '—' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F2F5' }}>
              <span style={{ fontSize: 12, color: '#8694A7' }}>{row.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1E3D' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Sélecteur de rôle */}
        {!isSelf && (
          <div style={{ marginBottom: 16 }}>
            <RoleSelector
              currentRole={user.role}
              onChange={(role) => onRoleChange(user, role)}
              isSuperAdmin={isSuperAdmin}
            />
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ActionBtn icon={<IcoKey color="#2E86C1" />} label="Envoyer un lien de reset du mot de passe" color="#2E86C1" bg="#EFF6FF" border="#BFDBFE" onClick={() => onResetPassword(user)} disabled={actionLoading} />
          <ActionBtn
            icon={user.blocked ? <IcoUnlock color={canBlock ? '#1D8348' : '#B0BFCC'} /> : <IcoLock color={canBlock ? '#D4860B' : '#B0BFCC'} />}
            label={user.blocked ? 'Débloquer le compte' : 'Bloquer le compte'}
            color={user.blocked ? '#1D8348' : '#D4860B'}
            bg={user.blocked ? '#F0FDF4' : '#FFFBEB'}
            border={user.blocked ? '#BBF7D0' : '#FDE68A'}
            onClick={() => onToggleBlock(user)}
            disabled={!canBlock || actionLoading}
            disabledReason="Action non autorisée sur ce compte"
          />
          <ActionBtn
            icon={<IcoTrash color={canDelete ? '#C0392B' : '#B0BFCC'} />}
            label="Supprimer le compte"
            color="#C0392B" bg="#FEF2F2" border="#FECACA"
            onClick={() => onDelete(user)}
            disabled={!canDelete || actionLoading}
            disabledReason={isSelf ? 'Vous ne pouvez pas supprimer votre propre compte' : 'Action non autorisée sur ce compte'}
          />
        </div>
      </div>
    </div>
  )
}

function ConfirmModal({ title, message, confirmLabel, confirmColor = '#C0392B', onConfirm, onCancel, loading }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 380, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0A1E3D', marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 13, color: '#8694A7', marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={loading} style={{ flex: 1, height: 40, borderRadius: 8, border: '1px solid #E8ECF0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#4A5568', cursor: 'pointer' }}>Annuler</button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 1, height: 40, borderRadius: 8, border: 'none', background: confirmColor, fontSize: 13, fontWeight: 700, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'En cours...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  const { user: currentUser }       = useAuth()
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [filter, setFilter]         = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirm, setConfirm]       = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast]           = useState(null)

  const isSuperAdmin = currentUser?.role === 'superadmin'

  const load = () => { usersApi.index().then(setUsers).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    if (filter === 'superadmin') return matchSearch && u.role === 'superadmin'
    if (filter === 'admin')      return matchSearch && u.role === 'admin'
    if (filter === 'beta')       return matchSearch && u.role === 'beta'
    if (filter === 'user')       return matchSearch && u.role === 'user'
    if (filter === 'unverified') return matchSearch && !u.email_verified_at
    if (filter === 'blocked')    return matchSearch && u.blocked
    return matchSearch
  })

  const handleDelete = (user) => {
    setConfirm({
      title: 'Supprimer le compte',
      message: `Supprimer définitivement le compte de ${user.name} (${user.email}) ? Cette action est irréversible.`,
      confirmLabel: 'Supprimer', confirmColor: '#C0392B',
      onConfirm: async () => {
        setActionLoading(true)
        try {
          await usersApi.destroy(user.id)
          setUsers(u => u.filter(x => x.id !== user.id))
          setSelectedUser(null); setConfirm(null)
          showToast('Compte supprimé.')
        } catch (e) { showToast(e.errors?.message || 'Erreur.', 'error') }
        finally { setActionLoading(false) }
      }
    })
  }

  const handleToggleBlock = (user) => {
    const blocking = !user.blocked
    setConfirm({
      title: blocking ? 'Bloquer le compte' : 'Débloquer le compte',
      message: blocking ? `Bloquer le compte de ${user.name} ?` : `Débloquer le compte de ${user.name} ?`,
      confirmLabel: blocking ? 'Bloquer' : 'Débloquer',
      confirmColor: blocking ? '#D4860B' : '#1D8348',
      onConfirm: async () => {
        setActionLoading(true)
        try {
          await usersApi.update(user.id, { blocked: blocking })
          const updated = { ...user, blocked: blocking }
          setUsers(u => u.map(x => x.id === user.id ? updated : x))
          setSelectedUser(updated); setConfirm(null)
          showToast(blocking ? 'Compte bloqué.' : 'Compte débloqué.')
        } catch (e) { showToast(e.errors?.message || 'Erreur.', 'error') }
        finally { setActionLoading(false) }
      }
    })
  }

  const handleResetPassword = async (user) => {
    setActionLoading(true)
    try {
      await api.post('/admin/users/' + user.id + '/reset-password', {})
      showToast('Email de reset envoyé à ' + user.email)
    } catch { showToast('Erreur lors de l\'envoi.', 'error') }
    finally { setActionLoading(false) }
  }

  const handleRoleChange = (user, newRole) => {
    setConfirm({
      title: 'Modifier le rôle',
      message: `Changer le rôle de ${user.name} de "${ROLE_STYLES[user.role]?.label}" vers "${ROLE_STYLES[newRole]?.label}" ?`,
      confirmLabel: 'Confirmer', confirmColor: '#0A1E3D',
      onConfirm: async () => {
        setActionLoading(true)
        try {
          await usersApi.update(user.id, { role: newRole })
          const updated = { ...user, role: newRole }
          setUsers(u => u.map(x => x.id === user.id ? updated : x))
          setSelectedUser(updated); setConfirm(null)
          showToast(`Rôle mis à jour : ${ROLE_STYLES[newRole]?.label}`)
        } catch (e) { showToast(e.errors?.message || 'Erreur.', 'error') }
        finally { setActionLoading(false) }
      }
    })
  }

  const FILTERS = [
    { id: 'all',        label: 'Tous',          count: users.length },
    { id: 'superadmin', label: 'Super Admin',   count: users.filter(u => u.role === 'superadmin').length },
    { id: 'admin',      label: 'Admin',         count: users.filter(u => u.role === 'admin').length },
    { id: 'beta',       label: 'Bêta',          count: users.filter(u => u.role === 'beta').length },
    { id: 'user',       label: 'User',          count: users.filter(u => u.role === 'user').length },
    { id: 'unverified', label: 'Non vérifiés',  count: users.filter(u => !u.email_verified_at).length },
    { id: 'blocked',    label: 'Bloqués',       count: users.filter(u => u.blocked).length },
  ]

  return (
    <div style={{ padding: 32 }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000, background: toast.type === 'error' ? '#C0392B' : '#1D8348', color: '#fff', borderRadius: 10, padding: '12px 18px', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
          {toast.msg}
        </div>
      )}

      {selectedUser && !confirm && (
        <UserModal
          user={selectedUser} currentUser={currentUser}
          onClose={() => setSelectedUser(null)}
          onDelete={handleDelete} onToggleBlock={handleToggleBlock}
          onResetPassword={handleResetPassword} onRoleChange={handleRoleChange}
          actionLoading={actionLoading}
        />
      )}
      {confirm && <ConfirmModal {...confirm} loading={actionLoading} onCancel={() => setConfirm(null)} />}

      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1E3D', letterSpacing: '-0.03em', marginBottom: 3 }}>Utilisateurs</h1>
          <p style={{ fontSize: 12, color: '#8694A7' }}>{users.length} compte{users.length > 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 12px', height: 36 }}>
          <IcoSearch />
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1C1F26', background: 'transparent', width: 200 }} />
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', background: filter === f.id ? '#0A1E3D' : '#fff', color: filter === f.id ? '#fff' : '#4A5568', fontSize: 12, fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            {f.label}
            <span style={{ background: filter === f.id ? 'rgba(255,255,255,0.2)' : '#F0F2F5', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px 100px 80px 50px', padding: '10px 16px', background: '#F7F8FA', borderBottom: '1px solid #E8ECF0' }}>
          {['Nom', 'Email', 'Rôle', 'Statut', 'Gardes', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#8694A7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8694A7', fontSize: 13 }}>Aucun résultat</div>
        ) : (
          filtered.map((user, i) => {
            const rs = ROLE_STYLES[user.role] || ROLE_STYLES.user
            return (
              <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px 100px 80px 50px', padding: '11px 16px', borderBottom: i < filtered.length - 1 ? '1px solid #F0F2F5' : 'none', background: user.id === currentUser?.id ? '#FFFBEB' : i % 2 === 0 ? '#fff' : '#FAFAFA', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1E3D' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    {user.role === 'superadmin' && <IcoShield color="#8E44AD" />}
                    <span>{user.name}</span>
                    {user.id === currentUser?.id && <span style={{ fontSize: 10, color: '#8694A7' }}>(vous)</span>}
                  </div>
                </span>
                <span style={{ fontSize: 12, color: '#4A5568' }}>{user.email}</span>
                <div><Badge label={rs.label} color={rs.color} bg={rs.bg} /></div>
                <div>
                  {user.blocked
                    ? <Badge label="Bloqué" color="#C0392B" bg="#FEF2F2" />
                    : user.email_verified_at
                      ? <Badge label="Actif" color="#1D8348" bg="#E6F2EC" />
                      : <Badge label="Non vérifié" color="#D4860B" bg="#FBF1E0" />
                  }
                </div>
                <span style={{ fontSize: 12, color: '#8694A7' }}>{user.shifts_count || 0}</span>
                <button onClick={() => setSelectedUser(user)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #BFDBFE', background: '#EFF6FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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