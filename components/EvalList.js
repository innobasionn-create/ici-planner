'use client'
import { useState } from 'react'
import { CalendarX } from 'lucide-react'
import { getWeekN, isPast, daysTo, fDate, WEEKS } from '@/lib/utils'
import { useSwap } from '@/lib/useSwap'
import { T, type } from '@/lib/theme'
import { Card, Pill, Segmented, Empty } from './ui'
import { DaysBadge } from './Badge'

const c = T.color

const TABS = [
  { id: 'todas',    label: 'Todas'            },
  { id: 'proximas', label: 'Próximas 14 días' },
  { id: 'criticas', label: 'Semanas críticas' },
]

// Las evaluaciones "grandes" (solemne, prueba, certamen, examen) van con acento.
const esMayor = tipo => /solemne|prueba|certamen|examen/i.test(tipo)

export function TipoPill({ tipo }) {
  return esMayor(tipo) ? <Pill tone="accent" withDot>{tipo}</Pill> : <Pill>{tipo}</Pill>
}

// Peso de la evaluación: mini barra 64×6 + porcentaje en mono.
function PesoBar({ peso }) {
  const p = Math.max(0, Math.min(100, parseFloat(peso) || 0))
  if (!peso) return <span style={{ ...type.mono, color: c.faint }}>—</span>
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 64, height: 6, borderRadius: T.radius.pill, background: c.track, overflow: 'hidden' }}>
        <div style={{ width: `${p}%`, height: '100%', background: c.ink, borderRadius: T.radius.pill }} />
      </div>
      <span style={{ ...type.mono, color: c.ink }}>{peso}%</span>
    </div>
  )
}

const COLS = 'minmax(0, 2.4fr) minmax(0, 1.4fr) 88px 56px 140px 88px'
const th = { ...type.eyebrow, padding: '0 12px' }

function TableRow({ e }) {
  return (
    <div className="pl-trow" style={{
      display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', minHeight: 72,
      borderTop: `1px solid ${c.line}`, borderRadius: 0, padding: '12px 0',
    }}>
      <div style={{ padding: '0 12px', minWidth: 0 }}>
        <div style={{ ...type.title, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.ramo}</div>
        {e.cont && (
          <div title={e.cont} style={{ fontSize: 13, color: c.muted, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {e.cont.replace(/\s*\n\s*/g, ' ')}
          </div>
        )}
      </div>
      <div style={{ padding: '0 12px', minWidth: 0 }}><TipoPill tipo={e.tipo} /></div>
      <div style={{ ...type.mono, padding: '0 12px' }}>{fDate(e.fecha)}</div>
      <div style={{ ...type.mono, padding: '0 12px', color: c.muted }}>S{getWeekN(e.fecha)}</div>
      <div style={{ padding: '0 12px' }}><PesoBar peso={e.peso} /></div>
      <div style={{ padding: '0 12px', display: 'flex', justifyContent: 'flex-end' }}><DaysBadge days={daysTo(e.fecha)} /></div>
    </div>
  )
}

function MobileItem({ e }) {
  return (
    <div className="pl-row pl-row--static" style={{ borderRadius: T.radius.row, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ ...type.title, fontSize: 15, minWidth: 0 }}>{e.ramo}</div>
        <DaysBadge days={daysTo(e.fecha)} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <TipoPill tipo={e.tipo} />
        <span style={{ ...type.mono, color: c.muted }}>{fDate(e.fecha)} · S{getWeekN(e.fecha)}</span>
      </div>
      {e.peso && <PesoBar peso={e.peso} />}
      {e.cont && <div style={{ ...type.muted, whiteSpace: 'pre-wrap' }}>{e.cont}</div>}
    </div>
  )
}

export function EvalList({ evals }) {
  const [tab, setTab] = useState('todas')
  const [shown, swapClass] = useSwap(tab)
  const hoy  = new Date(); hoy.setHours(0,0,0,0)
  const en14 = new Date(hoy); en14.setDate(hoy.getDate()+14)
  const todas = [...evals].sort((a,b) => a.fecha - b.fecha)
  const critNs = new Set()
  for (let n=1; n<=WEEKS; n++)
    if (!isPast(n) && evals.filter(e=>getWeekN(e.fecha)===n).length>=4) critNs.add(n)
  const lists = {
    todas,
    proximas: todas.filter(e => e.fecha >= hoy && e.fecha <= en14),
    criticas: todas.filter(e => critNs.has(getWeekN(e.fecha))),
  }
  const current = lists[shown]

  return (
    <Card enter={0}>
      <div style={{ marginBottom: 24 }}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={TABS.map(t => ({ ...t, count: lists[t.id].length }))}
        />
      </div>

      <div key={shown} className={swapClass}>
        {current.length === 0 ? (
          <Empty icon={CalendarX}>Sin evaluaciones en esta vista.</Empty>
        ) : (
          <>
            {/* Desktop: tabla */}
            <div className="pl-only-desktop" role="table">
              <div role="row" style={{ display: 'grid', gridTemplateColumns: COLS, height: 40, alignItems: 'center' }}>
                <div style={th}>Ramo</div>
                <div style={th}>Tipo</div>
                <div style={th}>Fecha</div>
                <div style={th}>Sem.</div>
                <div style={th}>Peso</div>
                <div style={{ ...th, textAlign: 'right' }}>Faltan</div>
              </div>
              {current.map((e, i) => <TableRow key={i} e={e} />)}
            </div>

            {/* Mobile: lista de cards */}
            <div className="pl-only-mobile pl-flex" style={{ flexDirection: 'column', gap: 8 }}>
              {current.map((e, i) => <MobileItem key={i} e={e} />)}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
