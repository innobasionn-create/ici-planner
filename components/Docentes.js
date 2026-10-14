'use client'
import { useState, useMemo } from 'react'
import { GraduationCap, Search, X, Mail, Phone, Copy, Check, UserSearch } from 'lucide-react'
import { T, type } from '@/lib/theme'
import { Card, Pill, Avatar, Button, IconButton, IconTile, Icon, Input, Empty } from './ui'

const c = T.color

function fPrecio(n) {
  return '$' + n.toLocaleString('es-CL')
}

function Verificado({ d }) {
  if (d.verificado) return <Pill tone="accent" icon={Check}>Verificado{d.credencial ? ' · ' + d.credencial : ''}</Pill>
  if (d.credencial) return <span style={{ fontSize: 14, color: c.muted }}>{d.credencial}</span>
  return null
}

function Precio({ d, size = 28 }) {
  if (!(d.tarifaHora > 0)) return <span style={{ fontSize: 15, fontWeight: 500, color: c.muted }}>Tarifa a consultar</span>
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ fontSize: size, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{fPrecio(d.tarifaHora)}</span>
      <span style={{ fontSize: 14, color: c.muted }}>CLP / hora</span>
    </span>
  )
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {contacto && (
        esLink
          ? <a href={contacto} target="_blank" rel="noopener noreferrer" className="pl-btn pl-btn--link" style={{ fontSize: 15, fontWeight: 600, color: c.ink, wordBreak: 'break-all' }}>{contacto}</a>
          : <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>{esMail && <Icon as={Mail} size={16} />}{contacto}</div>
      )}
      {fono && <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...type.mono, fontSize: 14, color: c.muted }}><Icon as={Phone} size={16} />{fono}</div>}
      <Button
        variant={copiado ? 'accent' : 'secondary'}
        size="sm"
        icon={copiado ? Check : Copy}
        onClick={copiar}
        className={copiado ? 'pl-pop' : ''}
        style={{ alignSelf: 'flex-start', marginTop: 4 }}
      >
        {copiado ? 'Copiado' : 'Copiar contacto'}
      </Button>
    </div>
  )
}

function TeacherCard({ d, onOpen, i }) {
  return (
    <Card enter={i} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Avatar name={d.nombre} />
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
          <div style={type.title}>{d.nombre}</div>
          <Verificado d={d} />
        </div>
      </div>
      {d.ramos.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {d.ramos.map(r => <Pill key={r}>{r}</Pill>)}
        </div>
      )}
      {d.bio && (
        <p style={{ ...type.muted, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d.bio}</p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${c.line}` }}>
        <Precio d={d} />
        <Button size="sm" onClick={() => onOpen(d)}>Ver perfil</Button>
      </div>
    </Card>
  )
}

function ProfileModal({ d, onClose }) {
  return (
    <div
      className="pl-fade"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: c.scrim, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={d.nombre}
        className="pl-pop"
        onClick={e => e.stopPropagation()}
        style={{
          background: c.surface, borderRadius: T.radius.card, boxShadow: T.shadow.pop,
          maxWidth: 440, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: 32,
          display: 'flex', flexDirection: 'column', gap: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Avatar name={d.nombre} size={56} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>{d.nombre}</div>
              <Verificado d={d} />
            </div>
          </div>
          <IconButton icon={X} label="Cerrar" onClick={onClose} style={{ marginRight: -8, marginTop: -4 }} />
        </div>

        {d.bio && <p style={{ ...type.muted, fontSize: 15, margin: 0 }}>{d.bio}</p>}

        {d.ramos.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {d.ramos.map(r => <Pill key={r}>{r}</Pill>)}
          </div>
        )}

        <div style={{ background: c.subtle, borderRadius: T.radius.row, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, color: c.muted }}>Valor de la sesión</span>
            <Precio d={d} size={24} />
          </div>
          <ContactoLinea contacto={d.contacto} fono={d.fono} />
          {!d.contacto && !d.fono && (
            <div style={{ fontSize: 14, color: c.muted }}>Sin datos de contacto cargados todavía.</div>
          )}
        </div>

        <div style={{ fontSize: 13, color: c.muted, lineHeight: 1.5, paddingLeft: 12, borderLeft: `2px solid ${c.line}` }}>
          La coordinación es directa con el docente por ahora — la agenda dentro de ICI Planner todavía no está construida.
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="pl-enter" style={{
        display: 'flex', alignItems: 'center', gap: 16,
        background: c.subtle, border: `1px dashed ${c.faint}`, borderRadius: T.radius.card, padding: '20px 24px',
      }}>
        <IconTile icon={GraduationCap} style={{ background: c.surface }} />
        <span style={{ fontSize: 14, color: c.muted, lineHeight: 1.6 }}>
          Docentes y ex-ayudantes verificados a mano por el equipo — hipótesis <b style={{ color: c.ink }}>H9</b> del Lean Canvas,
          todavía sin validar con entrevistas propias a profesores/tutores.
        </span>
      </div>

      <Input
        icon={Search}
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        placeholder="Buscar por ramo o nombre…"
        wrapStyle={{ maxWidth: 480 }}
      />

      {docentes.length === 0 ? (
        <Card enter={0}><Empty icon={GraduationCap}>Todavía no hay docentes cargados en la Sheet.</Empty></Card>
      ) : filtrados.length === 0 ? (
        <Card enter={0}><Empty icon={UserSearch}>Sin docentes que coincidan.</Empty></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
          {filtrados.map((d, i) => (
            <TeacherCard key={d.nombre} d={d} i={i} onOpen={setAbierto} />
          ))}
        </div>
      )}

      {abierto && <ProfileModal d={abierto} onClose={() => setAbierto(null)} />}
    </div>
  )
}
