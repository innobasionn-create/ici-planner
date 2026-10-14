'use client'
import { useState, useEffect } from 'react'
import { PanelLeft, RefreshCw, Bell, TriangleAlert, LoaderCircle } from 'lucide-react'
import { useData } from '@/lib/useData'
import { useSwap } from '@/lib/useSwap'
import { T, type } from '@/lib/theme'
import { Sidebar, Logo } from '@/components/Sidebar'
import { BottomBar } from '@/components/MobileNav'
import { Heatmap, CriticalWeek } from '@/components/Heatmap'
import { EvalList } from '@/components/EvalList'
import { RamoGrid } from '@/components/RamoGrid'
import { Alertas } from '@/components/Alertas'
import { getWeekN, WEEKS, isPast, fDate } from '@/lib/utils'
import { Documentos } from '@/components/Documentos'
import ResumenIA from '@/components/ResumenIA'
import { QRFormButton } from '@/components/QRFormButton'
import { Docentes } from '@/components/Docentes'
import { Card, Button, IconButton, Icon, Eyebrow } from '@/components/ui'

const c = T.color

function Metrics({ evals, ramos }) {
  const hoy = new Date(); hoy.setHours(0,0,0,0)
  let crit = 0
  for (let n=1; n<=WEEKS; n++)
    if (!isPast(n) && evals.filter(e=>getWeekN(e.fecha)===n).length>=4) crit++
  const up = [...evals].filter(e=>e.fecha>=hoy).sort((a,b)=>a.fecha-b.fecha)
  const nx = up[0]

  const cards = [
    { label: 'Evaluaciones registradas', value: evals.length, sub: 'en el semestre' },
    { label: 'Semanas críticas',         value: crit,         sub: 'con 4+ evaluaciones', accent: crit > 0 },
    { label: 'Próxima evaluación',       next: nx },
    { label: 'Ramos activos',            value: ramos.length, sub: 'este semestre' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 16 }}>
      {cards.map((k, i) => (
        <Card key={k.label} enter={i} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <div style={{ fontSize: 14, color: c.muted }}>{k.label}</div>
          {'next' in k ? (
            k.next ? (
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{k.next.ramo}</div>
                <div style={{ ...type.mono, color: c.muted, marginTop: 8 }}>{k.next.tipo} · {fDate(k.next.fecha)}</div>
              </div>
            ) : (
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>Sin próximas</div>
                <div style={{ ...type.mono, color: c.muted, marginTop: 8 }}>—</div>
              </div>
            )
          ) : (
            <>
              <div className="pl-kpi" style={{ ...type.kpi, fontSize: undefined, color: k.accent ? c.accent : c.ink }}>{k.value}</div>
              <div style={{ ...type.mono, color: c.muted }}>{k.sub}</div>
            </>
          )}
        </Card>
      ))}
    </div>
  )
}

function Overview({ evals, ramos, ramosActivos }) {
  const [sel, setSel] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Metrics evals={evals} ramos={ramos} />
      <Heatmap evals={evals} sel={sel} setSel={setSel} />
      <div className="pl-stack" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)', gap: 16 }}>
        <CriticalWeek evals={evals} onOpen={setSel} />
        <ResumenIA ramos={ramosActivos} />
      </div>
    </div>
  )
}

const PAGES = {
  overview:     { eyebrow: 'Tu semestre',   title: 'Vista general',   sub: 'Semestre 2026-1 · datos en vivo desde Google Sheets' },
  evaluaciones: { eyebrow: 'Calendario',    title: 'Evaluaciones',    sub: 'Todas las evaluaciones con contenidos registrados'    },
  ramos:        { eyebrow: 'Tus ramos',     title: 'Por ramo',        sub: 'Carga y evaluaciones desglosadas por asignatura'      },
  alertas:      { eyebrow: 'Próximos días', title: 'Alertas',         sub: 'Evaluaciones en los próximos 14 días'                 },
  documentos:   { eyebrow: 'Material',      title: 'Documentos',      sub: 'Pautas, certámenes anteriores y material de estudio'  },
  docentes:     { eyebrow: 'Tutorías',      title: 'Docentes',        sub: 'Clases online con docentes y ex-ayudantes verificados' },
}

export default function Home() {
  const [page, setPage]               = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [shown, swapClass]            = useSwap(page)

  const { evals, docs, docentes, ramos, ramosAll, ramosActivos, toggleRamo, seleccionarTodos, loading, error, synced, reload } = useData()

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ici-sidebar-open')
      if (saved !== null) setSidebarOpen(saved === 'true')
    } catch (e) {}
  }, [])

  const hoy  = new Date(); hoy.setHours(0,0,0,0)
  const en14 = new Date(hoy); en14.setDate(hoy.getDate()+14)
  const alertCount = evals.filter(e=>e.fecha>=hoy&&e.fecha<=en14).length

  const handleNav = id => {
    if (id === 'reload') { reload(); return }
    setPage(id)
    window.scrollTo({ top: 0 })
  }

  const handleToggle = () => {
    const next = !sidebarOpen
    setSidebarOpen(next)
    try { localStorage.setItem('ici-sidebar-open', String(next)) } catch (e) {}
  }

  const current = PAGES[shown]
  const filterProps = { ramosAll, ramosActivos, toggleRamo, seleccionarTodos }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: c.canvas }}>

      {/* Sidebar (desktop): el wrapper es el sticky y recorta la animación de colapso */}
      <div className="pl-only-desktop" style={{
        position: 'sticky', top: 0, height: '100vh', alignSelf: 'flex-start', flexShrink: 0, overflow: 'hidden',
        width: sidebarOpen ? 264 : 0,
        transition: `width ${T.motion.base} ${T.motion.out}`,
      }}>
        <Sidebar
          active={page}
          onNav={handleNav}
          alertCount={alertCount}
          synced={synced}
          {...filterProps}
        />
      </div>

      <main className="pl-main" style={{ flex: 1, minWidth: 0 }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>

          {/* Topbar */}
          <header style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <IconButton
                className="pl-only-desktop"
                icon={PanelLeft}
                label={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
                onClick={handleToggle}
                style={{ marginLeft: -8 }}
              />
              <span className="pl-only-mobile"><Logo compact /></span>
              <nav aria-label="Ruta" className="pl-only-desktop" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap' }}>
                <span style={{ color: c.muted }}>Planicy</span>
                <span style={{ color: c.faint }} aria-hidden="true">/</span>
                <span style={{ color: c.ink }}>{PAGES[page].title}</span>
              </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button variant="secondary" size="sm" icon={RefreshCw} onClick={reload} className="pl-only-desktop">
                Actualizar
              </Button>
              <IconButton icon={RefreshCw} label="Actualizar" onClick={reload} className="pl-only-mobile" />
              <IconButton icon={Bell} label="Alertas" onClick={() => handleNav('alertas')}>
                {alertCount > 0 && (
                  <span style={{ position: 'absolute', top: 7, right: 8, width: 7, height: 7, borderRadius: '50%', background: c.ink, boxShadow: `0 0 0 2px ${c.canvas}` }} />
                )}
              </IconButton>
            </div>
          </header>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, background: c.accentTint, color: c.accentInk,
              borderRadius: T.radius.row, padding: '16px 20px', fontSize: 14, fontWeight: 500, marginTop: 16,
            }}>
              <Icon as={TriangleAlert} size={18} />
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320, color: c.muted, fontSize: 15, gap: 12 }}>
              <Icon as={LoaderCircle} size={20} className="pl-spin" />
              Cargando datos del curso...
            </div>
          ) : (
            <div key={shown} className={swapClass}>
              {/* Encabezado de la vista */}
              <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Eyebrow>Planicy / {current.eyebrow}</Eyebrow>
                <h1 className="pl-h1" style={{ ...type.h1, fontSize: undefined }}>{current.title}</h1>
                <p style={{ ...type.muted, fontSize: 15, margin: 0 }}>{current.sub}</p>
              </div>

              {shown === 'overview'     && <Overview evals={evals} ramos={ramos} ramosActivos={ramosActivos} />}
              {shown === 'evaluaciones' && <EvalList evals={evals} />}
              {shown === 'ramos'        && <RamoGrid evals={evals} ramos={ramos} />}
              {shown === 'alertas'      && <Alertas evals={evals} />}
              {shown === 'documentos'   && <Documentos docs={docs} ramos={ramos} />}
              {shown === 'docentes'     && <Docentes docentes={docentes} />}
            </div>
          )}
        </div>
      </main>

      <BottomBar active={page} onNav={handleNav} alertCount={alertCount} {...filterProps} />
      <QRFormButton />
    </div>
  )
}
