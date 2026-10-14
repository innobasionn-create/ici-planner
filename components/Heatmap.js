'use client'
import { useState, useRef, useEffect } from 'react'
import { TriangleAlert, X, ArrowRight, CalendarCheck } from 'lucide-react'
import { WEEKS, getWeekN, isPast, nivelInfo, fDate, fRango } from '@/lib/utils'
import { T, type, heatLevel } from '@/lib/theme'
import { Card, Pill, IconButton, Icon, Button, Eyebrow, Empty } from './ui'
import { NivelBadge } from './Badge'

const c = T.color
const WEEK_NS = Array.from({ length: WEEKS }, (_, i) => i + 1)

const LEGEND = [
  { level: 0, label: 'Libre'        },
  { level: 1, label: 'Baja (1)'     },
  { level: 2, label: 'Moderada (2)' },
  { level: 3, label: 'Alta (3)'     },
  { level: 4, label: 'Crítica (4+)' },
]

const plural = n => `${n} evaluaci${n === 1 ? 'ón' : 'ones'}`

function Cell({ n, evs, isTotal, selected, onPick, onTip, label }) {
  const count = evs.length
  const past  = isPast(n)
  const heat  = heatLevel(count)
  const tip = isTotal
    ? `Semana ${n} · ${fRango(n)} · ${plural(count)}`
    : `${label} · ${count ? evs.map(e => e.tipo.toLowerCase()).join(', ') : 'sin evaluaciones'}`

  const show = e => {
    const r = e.currentTarget.getBoundingClientRect()
    onTip({ x: r.left + r.width / 2, y: r.top, text: tip })
  }

  return (
    <button
      type="button"
      className="pl-btn pl-cell-in"
      disabled={past}
      aria-label={tip}
      onClick={() => onPick(n)}
      onMouseEnter={show}
      onFocus={show}
      onMouseLeave={() => onTip(null)}
      onBlur={() => onTip(null)}
      style={{
        height: 48, borderRadius: T.radius.cell, border: 'none', padding: 0,
        background: heat.bg, color: heat.fg, cursor: past ? 'default' : 'pointer',
        opacity: past ? 0.4 : 1,
        boxShadow: selected ? `inset 0 0 0 2px ${c.ink}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.font.mono, fontSize: 14, fontWeight: isTotal ? 700 : 600,
        animationDelay: `${(n - 1) * 30}ms`,
        transition: `box-shadow ${T.motion.fast} ease-out, transform ${T.motion.fast} ${T.motion.out}`,
      }}
    >
      {count > 0 ? count : <span style={{ color: c.faint }}>·</span>}
    </button>
  )
}

export function Heatmap({ evals, sel, setSel }) {
  const [tip, setTip] = useState(null)
  const currentWeek = getWeekN(new Date())
  const scroller = useRef(null)

  // Si no caben todas las semanas (mobile), abre mostrando la semana actual.
  useEffect(() => {
    const el = scroller.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    const frac = (Math.max(currentWeek, 1) - 1) / WEEKS
    el.scrollLeft = Math.max(0, frac * el.scrollWidth - 140)
  }, [currentWeek])

  const byWeek = n => evals.filter(e => getWeekN(e.fecha) === n)
  const ramos  = [...new Set(evals.map(e => e.ramo))].sort((a, b) => a.localeCompare(b, 'es'))

  const pick = n => { if (!isPast(n)) setSel(sel === n ? null : n) }

  const selEvs = sel ? byWeek(sel).sort((a, b) => a.fecha - b.fecha) : []
  const nivel  = sel ? nivelInfo(selEvs.length) : null

  const grid = {
    display: 'grid', gap: 6, alignItems: 'center',
    gridTemplateColumns: `minmax(112px, 168px) repeat(${WEEKS}, minmax(36px, 1fr))`,
    minWidth: 168 + WEEKS * 42,
  }
  const labelCell = {
    position: 'sticky', left: 0, zIndex: 1, background: c.surface, height: 48,
    display: 'flex', alignItems: 'center', paddingRight: 12, minWidth: 0,
  }

  return (
    <Card enter={4} id="pl-heatmap">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={type.h2}>Mapa de carga semanal</h2>
          <p style={{ ...type.muted, margin: 0 }}>Evaluaciones por ramo en cada semana del semestre.</p>
        </div>
        <Pill>{plural(evals.length)}</Pill>
      </div>

      <div ref={scroller} style={{ overflowX: 'auto', margin: '0 -8px', padding: '0 8px 8px' }}>
        <div style={grid} role="grid" aria-label="Mapa de carga semanal">
          {/* Encabezado de semanas */}
          <div style={{ ...labelCell, height: 36 }} />
          {WEEK_NS.map(n => {
            const isCur = n === currentWeek
            const isSel = n === sel
            return (
              <div key={n} style={{ height: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <span style={{
                  fontFamily: T.font.mono, fontSize: 12, fontWeight: isCur || isSel ? 600 : 500,
                  color: isCur || isSel ? c.ink : c.muted,
                  textDecoration: isSel ? 'underline' : 'none', textUnderlineOffset: 3,
                }}>
                  S{n}
                </span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: isCur ? c.accent : 'transparent' }} />
              </div>
            )
          })}

          {/* Una fila por ramo */}
          {ramos.map(ramo => (
            <Row key={ramo} label={ramo}>
              {WEEK_NS.map(n => (
                <Cell key={n} n={n} label={ramo} evs={byWeek(n).filter(e => e.ramo === ramo)} selected={n === sel} onPick={pick} onTip={setTip} />
              ))}
            </Row>
          ))}

          {/* Total */}
          <Row label="Total de la semana" strong>
            {WEEK_NS.map(n => (
              <Cell key={n} n={n} isTotal evs={byWeek(n)} selected={n === sel} onPick={pick} onTip={setTip} />
            ))}
          </Row>
        </div>
      </div>

      {/* Leyenda */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 16 }}>
        {LEGEND.map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: T.heat[l.level] }} />
            <span style={{ fontSize: 13, color: c.muted }}>{l.label}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: T.heat[0], opacity: 0.4 }} />
          <span style={{ fontSize: 13, color: c.muted }}>Pasada</span>
        </div>
      </div>

      {/* Detalle de la semana seleccionada */}
      {sel && (
        <div className="pl-swap-in" style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${c.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={type.title}>Semana {sel} — {fRango(sel)}</span>
              <NivelBadge nivel={nivel} />
            </div>
            <IconButton icon={X} label="Cerrar detalle" onClick={() => setSel(null)} />
          </div>
          {selEvs.length === 0 ? (
            <p style={{ ...type.muted, margin: 0 }}>Sin evaluaciones. Semana ideal para adelantar contenidos.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selEvs.map((e, i) => (
                <div key={i} className="pl-row pl-row--static" style={{ borderRadius: T.radius.row, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{e.ramo}</span>
                    <span style={{ ...type.mono, color: c.muted }}>
                      {e.tipo}{e.peso ? ' · ' + e.peso + '%' : ''} · {fDate(e.fecha)}
                    </span>
                  </div>
                  {e.cont && (
                    <div style={{ ...type.muted, marginTop: 8, whiteSpace: 'pre-wrap' }}>{e.cont}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tooltip: position fixed para no quedar recortado por el scroll horizontal */}
      {tip && (
        <div role="tooltip" style={{
          position: 'fixed', left: tip.x, top: tip.y - 8, transform: 'translate(-50%, -100%)', zIndex: 400,
          background: c.ink, color: c.white, borderRadius: T.radius.pill, padding: '8px 14px',
          fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: T.shadow.card,
        }}>
          {tip.text}
        </div>
      )}
    </Card>
  )
}

function Row({ label, strong, children }) {
  return (
    <>
      <div style={{
        position: 'sticky', left: 0, zIndex: 1, background: c.surface, height: 48,
        display: 'flex', alignItems: 'center', paddingRight: 12, minWidth: 0,
      }}>
        <span title={label} style={{
          fontSize: 14, fontWeight: strong ? 600 : 500, color: c.ink,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {label}
        </span>
      </div>
      {children}
    </>
  )
}

// Panel "Semana crítica": la semana por venir con más evaluaciones.
export function CriticalWeek({ evals, onOpen }) {
  let best = null
  for (let n = 1; n <= WEEKS; n++) {
    if (isPast(n)) continue
    const count = evals.filter(e => getWeekN(e.fecha) === n).length
    if (count > 0 && (!best || count > best.count)) best = { n, count }
  }

  if (!best) {
    return (
      <Card enter={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty icon={CalendarCheck}>Sin evaluaciones registradas en las semanas que vienen.</Empty>
      </Card>
    )
  }

  const critica = best.count >= 4
  const open = () => {
    onOpen(best.n)
    document.getElementById('pl-heatmap')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Card enter={5} style={{
      display: 'flex', flexDirection: 'column', gap: 16,
      borderLeft: `3px solid ${critica ? c.accent : c.line}`,
    }}>
      <Eyebrow style={{ display: 'flex', alignItems: 'center', gap: 8, color: critica ? c.accentInk : c.muted }}>
        {critica && <Icon as={TriangleAlert} size={16} />}
        {critica ? 'Semana crítica' : 'Semana más cargada'}
      </Eyebrow>
      <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{fRango(best.n)}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ ...type.kpi, fontSize: 64, color: critica ? c.accent : c.ink }}>{best.count}</span>
        <span style={type.muted}>{best.count === 1 ? 'evaluación' : 'evaluaciones'} en la semana {best.n}</span>
      </div>
      <Button variant="link" iconRight={ArrowRight} onClick={open} style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
        Ver detalle
      </Button>
    </Card>
  )
}
