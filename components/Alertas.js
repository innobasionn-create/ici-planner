import { TriangleAlert, CalendarClock, Check } from 'lucide-react'
import { getWeekN, nivelInfo, fRango, fDateLong } from '@/lib/utils'
import { T, type } from '@/lib/theme'
import { Card, IconTile } from './ui'
import { NivelBadge } from './Badge'

const c = T.color

export function Alertas({ evals }) {
  const hoy  = new Date(); hoy.setHours(0,0,0,0)
  const en14 = new Date(hoy); en14.setDate(hoy.getDate()+14)
  const bySem = {}
  evals.filter(e=>e.fecha>=hoy&&e.fecha<=en14).forEach(e=>{
    const n=getWeekN(e.fecha)
    if(!bySem[n]) bySem[n]=[]
    bySem[n].push(e)
  })
  const semanas = Object.keys(bySem).map(Number).sort((a,b)=>a-b)

  if (semanas.length===0) return (
    <Card enter={0}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconTile icon={Check} variant="primary" />
        <span style={{ ...type.body }}>Sin evaluaciones en los próximos 14 días.</span>
      </div>
    </Card>
  )

  return (
    <Card enter={0} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {semanas.map(n=>{
        const evs=bySem[n].sort((a,b)=>a.fecha-b.fecha)
        const nivel=nivelInfo(evs.length)
        const critica = nivel.tone === 'accent'
        return (
          <div key={n} className="pl-row pl-row--static" style={{
            display: 'flex', alignItems: 'flex-start', gap: 16, borderRadius: T.radius.row, padding: '16px 20px',
          }}>
            <IconTile icon={critica ? TriangleAlert : CalendarClock} variant={critica ? 'accent' : 'neutral'} style={critica ? null : { background: c.surface }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...type.title, fontSize: 15, marginBottom: 8 }}>
                Semana {n} — {fRango(n)}
                <span style={{ fontWeight: 400, color: c.muted }}> · {evs.length} evaluación(es)</span>
              </div>
              {evs.map((e,i)=>(
                <div key={i} style={{ fontSize: 14, color: c.muted, lineHeight: 1.7 }}>
                  <span style={{ fontWeight: 600, color: c.ink }}>{e.ramo}</span>
                  {' — '}{e.tipo}
                  {e.cont ? ': ' + e.cont.slice(0,70) + '…' : ' · ' + fDateLong(e.fecha)}
                </div>
              ))}
            </div>
            <NivelBadge nivel={nivel} />
          </div>
        )
      })}
    </Card>
  )
}
