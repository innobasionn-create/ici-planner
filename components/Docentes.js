'use client'
import { useState, useMemo } from 'react'
import { Card } from './Card'

const GOLD = '#E0A94C'
const GOLD_SOFT = '#332711'

function fPrecio(n) {
  return '$' + n.toLocaleString('es-CL')
}

function iniciales(nombre) {
  const partes = nombre.trim().split(/\s+/)
  return ((partes[0]?.[0] || '') + (partes[1]?.[0] || '')).toUpperCase()
}

// Color determinístico por nombre, para no depender de un índice de lista.
const AVATAR_COLORS = ['#3FA372', '#4C8FE0', '#B5451B', '#8B5FBF', '#C7743F', '#2D8A8A']
function avatarColor(nombre) {
  let h = 0
  for (let i = 0; i < nombre.length; i++) h = (h * 31 + nombre.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

function ContactoLinea({ contacto, fono }) {
  const [copiado, setCopiado] = useState(false)
  const valor = contacto || fono
  if (!valor) return null

  const esLink = /^https?:\/\//i.test(contacto || '')
  const esMail = /@/.test(contacto || '')

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(fono || contacto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch (e) {}
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {contacto && (
        esLink
          ? <a href={contacto} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12.5px', color: GOLD }}>{contacto}</a>
          : <div style={{ fontSize: '12.5px', color: '#F0F0F0' }}>{esMail ? '✉ ' : ''}{contacto}</div>
      )}
      {fono && <div style={{ fontSize: '12.5px', color: '#888888' }}>📞 {fono}</div>}
      <button
        onClick={copiar}
        style={{
          alignSelf: 'flex-start', marginTop: '2px',
          fontSize: '11px', color: GOLD, background: 'none', border: 'none',
          cursor: 'pointer', padding: 0, fontWeight: '500',
        }}
      >
        {copiado ? '✓ Copiado' : 'Copiar contacto'}
      </button>
    </div>
  )
}

function TeacherCard({ d, onOpen }) {
  const color = avatarColor(d.nombre)
  return (
    <button
      onClick={() => onOpen(d)}
      style={{
        textAlign: 'left', cursor: 'pointer',
        background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '12px',
        padding: '16px', transition: 'background 120ms ease-out, border-color 120ms ease-out',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#1F1F1F'; e.currentTarget.style.borderColor = '#333333' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#1A1A1A'; e.currentTarget.style.borderColor = '#2A2A2A' }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
          background: color, color: '#0B0B0C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: '600',
        }}>
          {iniciales(d.nombre)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#F0F0F0' }}>{d.nombre}</div>
          {d.verificado ? (
            <div style={{ fontSize: '10.5px', fontWeight: '600', color: GOLD, marginTop: '2px' }}>
              ✓ Verificado{d.credencial ? ' · ' + d.credencial : ''}
            </div>
          ) : d.credencial ? (
            <div style={{ fontSize: '10.5px', color: '#888888', marginTop: '2px' }}>{d.credencial}</div>
          ) : null}
        </div>
      </div>
      {d.ramos.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '11px' }}>
          {d.ramos.map(r => (
            <span key={r} style={{
              fontSize: '10px', padding: '2.5px 8px', borderRadius: '20px',
              background: '#232323', color: '#888888', border: '1px solid #2A2A2A',
            }}>
              {r}
            </span>
          ))}
        </div>
      )}
      <div style={{
        display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
        marginTop: '13px', paddingTop: '12px', borderTop: '1px solid #2A2A2A',
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', fontFamily: 'monospace', color: '#F0F0F0' }}>
          {d.tarifaHora > 0 ? fPrecio(d.tarifaHora) + '/h' : 'Tarifa a consultar'}
        </div>
      </div>
    </button>
  )
}

function ProfileModal({ d, onClose }) {
  const color = avatarColor(d.nombre)
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 260,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        animation: 'fadeIn 150ms ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '16px',
          maxWidth: '420px', width: '100%', maxHeight: '85vh', overflowY: 'auto',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)', padding: '22px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
              background: color, color: '#0B0B0C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '600',
            }}>
              {iniciales(d.nombre)}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#F0F0F0' }}>{d.nombre}</div>
              {d.verificado ? (
                <div style={{ fontSize: '11px', fontWeight: '600', color: GOLD, marginTop: '2px' }}>
                  ✓ Verificado{d.credencial ? ' · ' + d.credencial : ''}
                </div>
              ) : d.credencial ? (
                <div style={{ fontSize: '11px', color: '#888888', marginTop: '2px' }}>{d.credencial}</div>
              ) : null}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888888', fontSize: '18px', lineHeight: 1, padding: '2px' }}
          >
            ✕
          </button>
        </div>

        {d.bio && (
          <p style={{ fontSize: '12.5px', color: '#888888', lineHeight: 1.7, marginTop: '16px' }}>
            {d.bio}
          </p>
        )}

        {d.ramos.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
            {d.ramos.map(r => (
              <span key={r} style={{
                fontSize: '10.5px', padding: '3px 9px', borderRadius: '20px',
                background: '#232323', color: '#888888', border: '1px solid #2A2A2A',
              }}>
                {r}
              </span>
            ))}
          </div>
        )}

        <div style={{
          marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #2A2A2A',
          background: GOLD_SOFT, margin: '18px -22px -22px', padding: '16px 22px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', color: '#888888' }}>Valor de la sesión</span>
            <b style={{ fontFamily: 'monospace', fontSize: '15px', color: '#F0F0F0' }}>
              {d.tarifaHora > 0 ? fPrecio(d.tarifaHora) + '/h' : 'A consultar'}
            </b>
          </div>
          <ContactoLinea contacto={d.contacto} fono={d.fono} />
          {!d.contacto && !d.fono && (
            <div style={{ fontSize: '11.5px', color: '#888888' }}>Sin datos de contacto cargados todavía.</div>
          )}
          <div style={{ fontSize: '10px', color: '#888888', marginTop: '10px', lineHeight: 1.5 }}>
            La coordinación es directa con el docente por ahora — la agenda dentro de ICI Planner todavía no está construida.
          </div>
        </div>
      </div>
    </div>
  )
}

export function Docentes({ docentes }) {
  const [busqueda, setBusqueda] = useState('')
  const [abierto, setAbierto] = useState(null)

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return docentes
    return docentes.filter(d =>
      d.nombre.toLowerCase().includes(q) ||
      d.ramos.some(r => r.toLowerCase().includes(q))
    )
  }, [busqueda, docentes])

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
        background: GOLD_SOFT, border: '1px solid rgba(224,169,76,0.3)', borderRadius: '10px',
        padding: '11px 16px', marginBottom: '18px', fontSize: '12px', color: GOLD, lineHeight: 1.6,
      }}>
        <span>🎓</span>
        <span>
          Docentes y ex-ayudantes verificados a mano por el equipo — hipótesis <b>H9</b> del Lean Canvas,
          todavía sin validar con entrevistas propias a profesores/tutores.
        </span>
      </div>

      <Card style={{ marginBottom: '18px' }}>
        <div style={{ padding: '14px 16px' }}>
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por ramo o nombre…"
            style={{
              width: '100%', fontSize: '12.5px', padding: '8px 12px', borderRadius: '7px',
              border: '1px solid #2A2A2A', background: '#0F0F0F', color: '#F0F0F0', outline: 'none',
            }}
          />
        </div>
      </Card>

      {docentes.length === 0 ? (
        <Card>
          <div style={{ padding: '48px', textAlign: 'center', fontSize: '13px', color: '#888888' }}>
            Todavía no hay docentes cargados en la Sheet.
          </div>
        </Card>
      ) : filtrados.length === 0 ? (
        <Card>
          <div style={{ padding: '48px', textAlign: 'center', fontSize: '13px', color: '#888888' }}>
            Sin docentes que coincidan.
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
          {filtrados.map(d => (
            <TeacherCard key={d.nombre} d={d} onOpen={setAbierto} />
          ))}
        </div>
      )}

      {abierto && <ProfileModal d={abierto} onClose={() => setAbierto(null)} />}
    </div>
  )
}
