'use client'
import { useState } from 'react'
import { LayoutGrid, CalendarDays, BookOpen, Bell, FileText, GraduationCap, RefreshCw, Search } from 'lucide-react'
import { T } from '@/lib/theme'
import { Icon, Eyebrow, Pill, Input, Toggle, Button, useSlider } from './ui'

const c = T.color

export const NAV = [
  { id: 'overview',     icon: LayoutGrid,    label: 'Vista general', short: 'Inicio'     },
  { id: 'evaluaciones', icon: CalendarDays,  label: 'Evaluaciones',  short: 'Calendario' },
  { id: 'ramos',        icon: BookOpen,      label: 'Por ramo',      short: 'Ramos'      },
  { id: 'alertas',      icon: Bell,          label: 'Alertas'                            },
  { id: 'documentos',   icon: FileText,      label: 'Documentos',    short: 'Material'   },
  { id: 'docentes',     icon: GraduationCap, label: 'Docentes'                           },
]

export function Logo({ compact }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: compact ? 32 : 36, height: compact ? 32 : 36, borderRadius: T.radius.logo, background: c.accent,
        color: c.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon as={CalendarDays} size={compact ? 18 : 20} />
      </div>
      <span style={{ fontSize: compact ? 19 : 22, fontWeight: 600, letterSpacing: '-0.03em', color: c.ink }}>
        Planicy
      </span>
    </div>
  )
}

// Item de navegación: pill de 44px. El fondo del activo lo pone el indicador deslizante.
export function NavItem({ item, active, onClick, badge, itemRef, ...rest }) {
  return (
    <button
      ref={itemRef}
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className="pl-btn pl-nav"
      style={{
        position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', width: '100%', height: 44,
        padding: '0 16px', border: 'none', borderRadius: T.radius.pill, cursor: 'pointer', textAlign: 'left',
      }}
      {...rest}
    >
      <span className="pl-nav__inner" style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        <Icon as={item.icon} size={18} />
        <span style={{ flex: 1, fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap' }}>{item.label}</span>
      </span>
      {badge}
    </button>
  )
}

export function navBadge(id, alertCount) {
  if (id === 'alertas' && alertCount > 0) {
    return <Pill style={{ fontFamily: T.font.mono, fontWeight: 500, height: 22, padding: '0 8px' }}>{alertCount}</Pill>
  }
  if (id === 'docentes') return <Pill tone="accent" style={{ height: 22, padding: '0 8px' }}>Nuevo</Pill>
  return null
}

// Filtro de ramos activos (sidebar en desktop, hoja "Más" en mobile).
export function RamoFilter({ ramosAll, ramosActivos, toggleRamo, seleccionarTodos }) {
  const todosActivos = ramosActivos === null
  const [busqueda, setBusqueda] = useState('')

  if (!ramosAll || ramosAll.length === 0) return null

  const ramosFiltrados = busqueda.trim()
    ? ramosAll.filter(r => r.name.toLowerCase().includes(busqueda.trim().toLowerCase()))
    : ramosAll

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 12px' }}>
        <Eyebrow>Mis ramos</Eyebrow>
        {!todosActivos && (
          <Button variant="link" onClick={seleccionarTodos} style={{ fontSize: 13 }}>Ver todos</Button>
        )}
      </div>

      <Input
        icon={Search}
        height={40}
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        placeholder="Buscar ramo…"
        style={{ fontSize: 14, borderRadius: T.radius.pill }}
        wrapStyle={{ marginBottom: 8 }}
      />

      {ramosFiltrados.length === 0 && (
        <div style={{ padding: '8px', fontSize: 14, color: c.muted }}>Sin ramos que coincidan.</div>
      )}

      {ramosFiltrados.map(r => {
        const activo = todosActivos || (ramosActivos && ramosActivos.includes(r.name))
        return (
          <button
            key={r.name}
            type="button"
            role="switch"
            aria-checked={!!activo}
            onClick={() => toggleRamo(r.name)}
            className="pl-btn pl-btn--ghost"
            style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 40,
              padding: '0 8px 0 12px', border: 'none', borderRadius: T.radius.pill, cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{
              flex: 1, minWidth: 0, fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              color: activo ? c.ink : c.muted, transition: `color ${T.motion.fast} ease-out`,
            }}>
              {r.name}
            </span>
            <Toggle visual size="sm" on={!!activo} />
          </button>
        )
      })}
    </div>
  )
}

export function Sidebar({ active, onNav, alertCount, synced, ramosAll, ramosActivos, toggleRamo, seleccionarTodos }) {
  const { wrap, ref, box } = useSlider(active, 'y')

  return (
    <aside style={{
      width: 264, height: '100%', background: c.canvas,
      display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', padding: '24px 16px',
    }}>
      <div style={{ padding: '0 8px', height: 48, display: 'flex', alignItems: 'center' }}>
        <Logo />
      </div>

      <Eyebrow style={{ padding: '32px 8px 12px' }}>Tu espacio académico</Eyebrow>

      <nav ref={wrap} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {box && (
          <span aria-hidden="true" style={{
            position: 'absolute', left: 0, right: 0, top: box.top, height: box.height,
            background: c.ink, borderRadius: T.radius.pill,
            transition: `top ${T.motion.base} ${T.motion.spring}`,
          }} />
        )}
        {NAV.map(item => (
          <NavItem
            key={item.id}
            item={item}
            itemRef={ref(item.id)}
            active={active === item.id}
            onClick={() => onNav(item.id)}
            badge={navBadge(item.id, alertCount)}
            data-nav={item.id}
          />
        ))}
      </nav>

      <div style={{ paddingTop: 32 }}>
        <RamoFilter ramosAll={ramosAll} ramosActivos={ramosActivos} toggleRamo={toggleRamo} seleccionarTodos={seleccionarTodos} />
      </div>

      <div style={{ paddingTop: 32 }}>
        <Eyebrow style={{ padding: '0 8px 12px' }}>Datos</Eyebrow>
        <NavItem item={{ icon: RefreshCw, label: 'Actualizar datos' }} onClick={() => onNav('reload')} />
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 32 }}>
        <div style={{ background: c.surface, borderRadius: T.radius.row, padding: '16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Semestre 2026-1</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: c.muted }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.ink }} />
            En vivo desde Sheets
          </div>
          {synced && (
            <div style={{ fontFamily: T.font.mono, fontSize: 12, color: c.muted }}>
              Sync {synced.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
