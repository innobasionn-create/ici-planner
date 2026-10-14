'use client'
import { useState } from 'react'
import { MoreHorizontal, X, RefreshCw } from 'lucide-react'
import { T } from '@/lib/theme'
import { Icon, IconButton, useSlider } from './ui'
import { NAV, NavItem, navBadge, RamoFilter } from './Sidebar'

const c = T.color
const BAR = ['overview', 'evaluaciones', 'ramos', 'documentos']
const MORE = NAV.filter(n => !BAR.includes(n.id))

// Bottom bar móvil: 4 vistas + "Más". El activo es una pill ink que se desliza.
export function BottomBar({ active, onNav, alertCount, ...filterProps }) {
  const [open, setOpen] = useState(false)
  const activeKey = BAR.includes(active) ? active : 'more'
  const { wrap, ref, box } = useSlider(activeKey)
  const items = [...NAV.filter(n => BAR.includes(n.id)), { id: 'more', icon: MoreHorizontal, short: 'Más' }]

  const go = id => { setOpen(false); onNav(id) }

  return (
    <>
      <nav
        ref={wrap}
        className="pl-only-mobile pl-flex"
        style={{
          position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 200, height: 64, padding: 8,
          background: c.surface, borderRadius: T.radius.pill, boxShadow: T.shadow.pop,
          alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {box && (
          <span aria-hidden="true" style={{
            position: 'absolute', top: 8, bottom: 8, left: box.left, width: box.width,
            background: c.ink, borderRadius: T.radius.pill,
            transition: `left ${T.motion.base} ${T.motion.spring}`,
          }} />
        )}
        {items.map(it => {
          const on = it.id === activeKey
          return (
            <button
              key={it.id}
              ref={ref(it.id)}
              type="button"
              aria-label={it.short || it.label}
              aria-current={on ? 'page' : undefined}
              data-nav={it.id}
              onClick={() => (it.id === 'more' ? setOpen(true) : go(it.id))}
              className="pl-btn"
              style={{
                position: 'relative', zIndex: 1, flex: 1, height: 48, border: 'none', borderRadius: T.radius.pill,
                background: 'transparent', cursor: 'pointer', color: on ? c.white : c.ink,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `color ${T.motion.base} ${T.motion.out}`,
              }}
            >
              <Icon as={it.icon} size={22} />
              {it.id === 'more' && alertCount > 0 && (
                <span style={{ position: 'absolute', top: 10, right: '30%', width: 6, height: 6, borderRadius: '50%', background: on ? c.white : c.ink }} />
              )}
            </button>
          )
        })}
      </nav>

      {open && (
        <div
          className="pl-fade"
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 300, background: c.scrim, display: 'flex', alignItems: 'flex-end' }}
        >
          <div
            className="pl-sheet"
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxHeight: '85vh', overflowY: 'auto', background: c.canvas,
              borderRadius: `${T.radius.card}px ${T.radius.card}px 0 0`, padding: '16px 16px 32px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 16px' }}>
              <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>Más</span>
              <IconButton icon={X} label="Cerrar" onClick={() => setOpen(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {MORE.map(item => (
                <NavItem
                  key={item.id}
                  item={item}
                  active={active === item.id}
                  onClick={() => go(item.id)}
                  badge={navBadge(item.id, alertCount)}
                  data-nav-more={item.id}
                  style={{
                    position: 'relative', display: 'flex', alignItems: 'center', width: '100%', height: 44,
                    padding: '0 16px', border: 'none', borderRadius: T.radius.pill, cursor: 'pointer', textAlign: 'left',
                    background: active === item.id ? c.ink : 'transparent',
                  }}
                />
              ))}
              <NavItem item={{ icon: RefreshCw, label: 'Actualizar datos' }} onClick={() => go('reload')} />
            </div>
            <div style={{ paddingTop: 24 }}>
              <RamoFilter {...filterProps} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
