'use client'
import { useState } from 'react'

const NAV = [
  { id: 'overview',     emoji: '⊞', label: 'Vista general'  },
  { id: 'evaluaciones', emoji: '☰', label: 'Evaluaciones'   },
  { id: 'ramos',        emoji: '⊟', label: 'Por ramo'       },
  { id: 'alertas',      emoji: '◎', label: 'Alertas'        },
  { id: 'documentos',   emoji: '📄', label: 'Documentos'     },
  { id: 'docentes',     emoji: '🎓', label: 'Docentes'       },
]

export function Sidebar({ active, onNav, alertCount, synced, ramosAll, ramosActivos, toggleRamo, seleccionarTodos, isMobile, sidebarOpen }) {
  const todosActivos = ramosActivos === null;
  const [busqueda, setBusqueda] = useState('');

  const ramosFiltrados = busqueda.trim()
    ? (ramosAll || []).filter(r => r.name.toLowerCase().includes(busqueda.trim().toLowerCase()))
    : (ramosAll || []);

  return (
    <aside style={{
      width: '240px',
      flexShrink: 0,
      background: '#111111',
      borderRight: '1px solid #2A2A2A',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      ...(isMobile ? {
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100%',
        zIndex: 200,
        paddingTop: '56px',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 250ms cubic-bezier(0.23, 1, 0.32, 1)',
      } : {
        height: '100%',
      }),
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #2A2A2A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'linear-gradient(135deg, #2D6A4F, #40916C)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', color: 'white', fontWeight: '600',
          }}>I</div>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#F0F0F0', letterSpacing: '-0.3px' }}>
            ICI Planner
          </span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#888888', paddingLeft: '38px' }}>
          Semestre 2026-1
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 8px', flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: '500', color: '#888888', padding: '0 8px 6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Vistas
        </div>
        {NAV.map(item => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                width: '100%', padding: '7px 10px', borderRadius: '6px',
                border: 'none',
                background: isActive ? '#F0F0F0' : 'transparent',
                color: isActive ? '#0F0F0F' : '#888888',
                fontSize: '14px', fontWeight: isActive ? '500' : '400',
                cursor: 'pointer', textAlign: 'left', marginBottom: '2px',
                transition: 'background 120ms ease-out, color 120ms ease-out',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#222222' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: '16px', opacity: 0.7 }}>{item.emoji}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === 'alertas' && alertCount > 0 && (
                <span style={{
                  fontSize: '10px', fontWeight: '600',
                  background: '#FFDDD8', color: '#C73A1F',
                  padding: '1px 7px', borderRadius: '10px',
                }}>
                  {alertCount}
                </span>
              )}
              {item.id === 'docentes' && (
                <span style={{
                  fontSize: '9px', fontWeight: '700',
                  background: '#332711', color: '#E0A94C',
                  padding: '1px 6px', borderRadius: '10px',
                }}>
                  Nuevo
                </span>
              )}
            </button>
          )
        })}

        <div style={{ height: '1px', background: '#2A2A2A', margin: '12px 8px' }} />

        {/* Filtro de ramos */}
        {ramosAll && ramosAll.length > 0 && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 8px 6px',
            }}>
              <span style={{ fontSize: '11px', fontWeight: '500', color: '#888888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Mis ramos
              </span>
              {!todosActivos && (
                <button
                  onClick={seleccionarTodos}
                  style={{
                    fontSize: '10px', color: '#2D6A4F', fontWeight: '500',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  Ver todos
                </button>
              )}
            </div>

            {/* Buscador de ramos */}
            <div style={{ padding: '0 8px 8px' }}>
              <input
                type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar ramo…"
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #2A2A2A',
                  background: '#1A1A1A',
                  color: '#F0F0F0',
                  fontSize: '12.5px',
                  outline: 'none',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#3A3A3A'}
                onBlur={e => e.currentTarget.style.borderColor = '#2A2A2A'}
              />
            </div>

            {ramosFiltrados.length === 0 && (
              <div style={{ padding: '4px 10px 8px', fontSize: '12px', color: '#888888' }}>
                Sin ramos que coincidan.
              </div>
            )}

            {ramosFiltrados.map(r => {
              const activo = todosActivos || (ramosActivos && ramosActivos.includes(r.name));
              return (
                <button
                  key={r.name}
                  onClick={() => toggleRamo(r.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    width: '100%', padding: '6px 10px', borderRadius: '6px',
                    border: 'none', background: 'transparent',
                    cursor: 'pointer', textAlign: 'left', marginBottom: '1px',
                    transition: 'background 120ms ease-out',
                    opacity: activo ? 1 : 0.4,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#222222'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: activo ? r.color : '#444444',
                    flexShrink: 0, transition: 'opacity 150ms ease-out, transform 150ms ease-out',
                  }} />
                  <span style={{
                    fontSize: '12.5px',
                    color: activo ? '#F0F0F0' : '#888888',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    transition: 'color 150ms ease-out',
                  }}>
                    {r.name}
                  </span>
                </button>
              )
            })}

            <div style={{ height: '1px', background: '#2A2A2A', margin: '12px 8px' }} />
          </>
        )}

        <div style={{ fontSize: '11px', fontWeight: '500', color: '#888888', padding: '0 8px 6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Datos
        </div>
        <button
          onClick={() => onNav('reload')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            width: '100%', padding: '7px 10px', borderRadius: '6px',
            border: 'none', background: 'transparent',
            color: '#888888', fontSize: '14px', cursor: 'pointer',
            textAlign: 'left', transition: 'background 120ms ease-out',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#222222'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontSize: '16px', opacity: 0.7 }}>↻</span>
          Actualizar datos
        </button>
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #2A2A2A', fontSize: '11.5px', color: '#888888' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
          <span style={{
            display: 'inline-block', width: '6px', height: '6px',
            borderRadius: '50%', background: '#2D6A4F',
          }} />
          En vivo desde Sheets
        </div>
        {synced && (
          <div style={{ fontFamily: 'monospace', fontSize: '10.5px' }}>
            Sync {synced.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </aside>
  )
}
