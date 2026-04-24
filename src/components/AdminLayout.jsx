import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Icônes SVG
const IcoDashboard     = ({ color }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
const IcoUsers         = ({ color }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
const IcoShifts        = ({ color }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IcoInterventions = ({ color }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
const IcoSac           = ({ color }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="7" width="19" height="14" rx="2"/><path d="M10 7V5.5a2 2 0 014 0V7"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="9.5" y1="13.5" x2="14.5" y2="13.5"/></svg>
const IcoHospitals     = ({ color }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IcoWaitlist      = ({ color }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const IcoLogout        = ({ color }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IcoChevLeft      = ({ color }) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
const IcoChevRight     = ({ color }) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>

const NAV = [
  { path: '/',              label: 'Dashboard',      Icon: IcoDashboard     },
  { path: '/users',         label: 'Utilisateurs',   Icon: IcoUsers         },
  { path: '/shifts',        label: 'Gardes',         Icon: IcoShifts        },
  { path: '/interventions', label: 'Interventions',  Icon: IcoInterventions },
  { path: '/sac',           label: 'Sac / Articles', Icon: IcoSac           },
  { path: '/hospitals',     label: 'Hôpitaux',       Icon: IcoHospitals     },
  { path: '/waitlist',      label: 'Waitlist',       Icon: IcoWaitlist      },
]

const BANNER_TEXT = '⚠️  ESPACE ADMINISTRATION  —  Accès restreint  ·  Toute modification est immédiatement appliquée en production  ·  Procédez avec précaution  ·  '

export default function AdminLayout({ children }) {
  const { user, logout }          = useAuth()
  const location                  = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F0F2F5', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Bandeau défilant rouge */}
      <div style={{
        backgroundColor: '#C0392B', overflow: 'hidden',
        height: 32, display: 'flex', alignItems: 'center',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      }}>
        <div style={{ display: 'flex', animation: 'marquee 24s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.08em', paddingRight: 60 }}>
              {BANNER_TEXT}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      <div style={{ display: 'flex', flex: 1, marginTop: 32 }}>

        {/* Sidebar light */}
        <div style={{
          width: collapsed ? 56 : 220,
          background: '#fff', borderRight: '1px solid #E8ECF0',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.2s', flexShrink: 0,
          position: 'fixed', top: 32, left: 0, bottom: 0, zIndex: 100,
          boxShadow: '1px 0 4px rgba(0,0,0,0.04)',
        }}>

          {/* Logo */}
          <div style={{ padding: '14px 12px', borderBottom: '1px solid #E8ECF0', display: 'flex', alignItems: 'center', gap: 10, minHeight: 60 }}>
            <svg width="30" height="30" viewBox="0 0 120 120" fill="none" style={{ flexShrink: 0 }}>
              <rect width="120" height="120" rx="26" fill="#0A1E3D"/>
              <path d="M52 32H68V48H84V64H68V88H52V64H36V48H52Z" fill="#2E86C1"/>
              <path d="M24 76L40 76L46 66L52 82L58 70L62 76L96 76" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" fill="none"/>
            </svg>
            {!collapsed && (
              <div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: '-0.03em' }}>
                  <span style={{ color: '#0A1E3D' }}>Assist</span>
                  <span style={{ color: '#2E86C1' }}>Ambu</span>
                </div>
                <div style={{ fontSize: 9, color: '#C0392B', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>
                  Administration
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
            {NAV.map(({ path, label, Icon }) => {
              const isActive = location.pathname === path
              const color    = isActive ? '#2E86C1' : '#8694A7'
              return (
                <Link
                  key={path}
                  to={path}
                  title={collapsed ? label : ''}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 10px',
                    borderRadius: 8, marginBottom: 2,
                    textDecoration: 'none',
                    background: isActive ? '#EFF6FF' : 'transparent',
                    borderLeft: isActive ? '2px solid #2E86C1' : '2px solid transparent',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    transition: 'background 0.15s',
                  }}
                >
                  <Icon color={color} />
                  {!collapsed && (
                    <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? '#0A1E3D' : '#4A5568' }}>
                      {label}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User + déconnexion */}
          <div style={{ padding: '10px 8px', borderTop: '1px solid #E8ECF0' }}>
            {!collapsed && user && (
              <div style={{ padding: '8px 10px', marginBottom: 8, background: '#F7F8FA', borderRadius: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0A1E3D' }}>{user.name}</div>
                <div style={{ fontSize: 10, color: '#8694A7', marginTop: 1 }}>{user.email}</div>
              </div>
            )}
            <button
              onClick={logout}
              title={collapsed ? 'Déconnexion' : ''}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 10px', borderRadius: 8,
                border: '1px solid #FECACA', cursor: 'pointer',
                background: '#FEF2F2',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <IcoLogout color="#C0392B" />
              {!collapsed && <span style={{ fontSize: 12, color: '#C0392B', fontWeight: 600 }}>Déconnexion</span>}
            </button>
          </div>

          {/* Toggle collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: 'absolute', top: 18, right: -11,
              width: 22, height: 22, borderRadius: '50%',
              background: '#2E86C1', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            {collapsed ? <IcoChevRight color="#fff" /> : <IcoChevLeft color="#fff" />}
          </button>
        </div>

        {/* Contenu */}
        <div style={{ flex: 1, marginLeft: collapsed ? 56 : 220, transition: 'margin-left 0.2s', minHeight: 'calc(100vh - 32px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}