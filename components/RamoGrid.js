import { BookOpen } from 'lucide-react'
import { daysTo, fDate } from '@/lib/utils'
import { T, type } from '@/lib/theme'
import { Card, Eyebrow, Empty } from './ui'
import { DaysBadge } from './Badge'
import { TipoPill } from './EvalList'

const c = T.color

export function RamoGrid({ evals, ramos }) {
  if (ramos.length === 0) {
    return (
      <Card enter={0}>
        <Empty icon={BookOpen}>Activa tus ramos en el menú para ver su carga.</Empty>
      </Card>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))', gap: 16 }}>
      {ramos.map((r, idx) => {
        const evs = [...evals].filter(e=>e.ramo===r.name).sort((a,b)=>a.fecha-b.fecha)
        const tot = evs.reduce((s,e)=>s+(parseFloat(e.peso)||0),0)
        return (
          <Card key={r.name} enter={idx} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Eyebrow>
                {evs.length} {evs.length === 1 ? 'evaluación' : 'evaluaciones'}{tot ? ' · ' + tot + '%' : ''}
              </Eyebrow>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.25 }}>{r.name}</div>
              {tot > 0 && (
                <div style={{ height: 6, borderRadius: T.radius.pill, background: c.track, overflow: 'hidden', marginTop: 4 }}>
                  <div style={{ width: `${Math.min(tot, 100)}%`, height: '100%', background: c.ink, borderRadius: T.radius.pill }} />
                </div>
              )}
            </div>

            {evs.length === 0 ? (
              <div style={{ ...type.muted }}>Sin evaluaciones registradas.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {evs.map((e, i) => {
                  const days = daysTo(e.fecha)
                  return (
                    <div key={i} className="pl-row pl-row--static" style={{
                      borderRadius: T.radius.row, padding: '16px 20px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
                    }}>
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <TipoPill tipo={e.tipo} />
                          <span style={{ ...type.mono, color: c.muted }}>
                            {e.peso ? e.peso + '% · ' : ''}{fDate(e.fecha)}
                          </span>
                        </div>
                        {e.cont && (
                          <div style={{ fontSize: 14, color: c.muted, lineHeight: 1.5 }}>
                            {e.cont.slice(0,80)}{e.cont.length>80?'…':''}
                          </div>
                        )}
                      </div>
                      {days >= 0 && <DaysBadge days={days} />}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
