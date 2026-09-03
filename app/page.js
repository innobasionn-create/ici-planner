'use client'
import { useState, useEffect } from 'react'
import { useData } from '@/lib/useData'
import { Sidebar } from '@/components/Sidebar'
import { Heatmap } from '@/components/Heatmap'
import { EvalList } from '@/components/EvalList'
import { RamoGrid } from '@/components/RamoGrid'
import { Alertas } from '@/components/Alertas'
import { getWeekN, daysTo, WEEKS, isPast, fDate } from '@/lib/utils'
import { Documentos } from '@/components/Documentos'
import ResumenIA from '@/components/ResumenIA'
import { QRFormButton } from '@/components/QRFormButton'
import { Docentes } from '@/components/Docentes'

function Metrics({ evals, ramos }) {
  const hoy = new Date(); hoy.setHours(0,0,0,0)
  let crit = 0
  for (let n=1; n<=WEEKS; n++)
    if (!isPast(n) && evals.filter(e=>getWeekN(e.fecha)===n).length>=4) crit++
  const up = [...evals].filter(e=>e.fecha>=hoy).sort((a,b)=>a.fecha-b.fecha)
  const nx = up[0]

  const cards = [
    { label: 'Evaluaciones registradas', value: evals.length,       sub: 'en el semestre',        color: '#F0F0F0' },
    { label: 'Semanas críticas',         value: crit,               sub: 'con 4+ evaluaciones',   color: crit > 0 ? '#C73A1F' : '#F0F0F0' },
    { label: 'Próxima evaluación',       value: nx ? nx.tipo : 'Sin próximas', sub: nx ? `${nx.ramo} · ${fDate(nx.fecha)}` : '—', color: '#F0F0F0', small: true },
    { label: 'Ramos activos',            value: ramos.length,       sub: 'este semestre',         color: '#F0F0F0' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '12px', marginBottom: '24px' }}>
      {cards.map(c => (
        <div key={c.label} style={{
          background: '#1A1A1A',
          border: '1px solid #2A2A2A',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}>
          <div style={{ fontSize: '12px', color: '#888888', marginBottom: '8px', fontWeight: '500' }}>{c.label}</div>
          <div style={{
            fontSize: c.small ? '16px' : '30px',
            fontWeight: c.small ? '600' : '300',
            letterSpacing: c.small ? '-0.3px' : '-1px',
            color: c.color,
            lineHeight: 1.1,
            marginBottom: '6px',
          }}>
            {c.value}
          </div>
          <div style={{ fontSize: '12px', color: '#888888' }}>{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

const PAGES = {
  overview:     { title: 'Vista general',   sub: 'Semestre 2026-1 · datos en vivo desde Google Sheets' },
  evaluaciones: { title: 'Evaluaciones',    sub: 'Todas las evaluaciones con contenidos registrados'    },
  ramos:        { title: 'Por ramo',        sub: 'Carga y evaluaciones desglosadas por asignatura'      },
  alertas:      { title: 'Alertas',         sub: 'Evaluaciones en los próximos 14 días'                 },
  documentos:   { title: 'Documentos',      sub: 'Pautas, certámenes anteriores y material de estudio'  },
  docentes:     { title: 'Docentes',        sub: 'Clases online con docentes y ex-ayudantes verificados' },
}

export default function Home() {
  const [page, setPage]           = useState('overview')
  const [isMobile, setIsMobile]   = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { evals, docs, docentes, ramos, ramosAll, ramosActivos, toggleRamo, seleccionarTodos, loading, error, synced, reload, rColor } = useData()

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        const saved = localStorage.getItem('ici-sidebar-open')
        setSidebarOpen(saved === null ? true : saved === 'true')
      } else {
        setSidebarOpen(false)
      }
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const hoy  = new Date(); hoy.setHours(0,0,0,0)
  const en14 = new Date(hoy); en14.setDate(hoy.getDate()+14)
  const alertCount = evals.filter(e=>e.fecha>=hoy&&e.fecha<=en14).length

  const handleNav = id => {
    if (id === 'reload') { reload(); return }
    setPage(id)
    if (isMobile) setSidebarOpen(false)
  }

  const handleToggle = () => {
    const next = !sidebarOpen
    setSidebarOpen(next)
    if (!isMobile) localStorage.setItem('ici-sidebar-open', String(next))
  }

  const current = PAGES[page]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F0F0F' }}>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 199,
            animation: 'fadeIn 200ms ease-out',
          }}
        />
      )}

      {/* Mobile fixed toggle button */}
      {isMobile && (
        <button
          onClick={handleToggle}
          style={{
            position: 'fixed',
            top: '12px',
            left: '12px',
            zIndex: 300,
            background: '#1A1A1A',
            border: '1px solid #2A2A2A',
            borderRadius: '8px',
            cursor: 'pointer',
            padding: '8px 10px',
            color: '#F0F0F0',
            fontSize: '18px',
            lineHeight: 1,
            transition: 'background 120ms ease-out',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#222222'}
          onMouseLeave={e => e.currentTarget.style.background = '#1A1A1A'}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Sidebar wrapper — desktop: sticky container that clips the slide animation */}
      <div style={!isMobile ? {
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0,
        width: sidebarOpen ? '240px' : '0px',
        minWidth: sidebarOpen ? '240px' : '0px',
        overflow: 'hidden',
        transition: 'width 250ms cubic-bezier(0.23, 1, 0.32, 1), min-width 250ms cubic-bezier(0.23, 1, 0.32, 1)',
        alignSelf: 'flex-start',
      } : { width: 0, flexShrink: 0 }}>
        <Sidebar
          active={page}
          onNav={handleNav}
          alertCount={alertCount}
          synced={synced}
          ramosAll={ramosAll}
          ramosActivos={ramosActivos}
          toggleRamo={toggleRamo}
          seleccionarTodos={seleccionarTodos}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
        />
      </div>

      {/* Main content */}
      <main style={{
        flex: 1,
        minWidth: 0,
        padding: isMobile ? '64px 20px 36px' : '36px 40px',
        overflowY: 'auto',
      }}>
        <div style={{ maxWidth: '1100px', width: '100%' }}>

          {/* Error */}
          {error && (
            <div style={{
              background: '#2A0808', border: '1px solid #7A1F1F',
              borderRadius: '8px', padding: '12px 16px',
              fontSize: '13px', color: '#C73A1F', marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#888888', fontSize: '14px', gap: '10px' }}>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '18px' }}>↻</span>
              Cargando datos del curso...
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  {/* Desktop toggle button */}
                  {!isMobile && (
                    <button
                      onClick={handleToggle}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '8px',
                        color: '#F0F0F0',
                        fontSize: '18px',
                        lineHeight: 1,
                        flexShrink: 0,
                        transition: 'background 120ms ease-out',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#222222'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      {sidebarOpen ? '✕' : '☰'}
                    </button>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '600', letterSpacing: '-0.5px', color: '#F0F0F0', margin: 0, lineHeight: 1.2 }}>
                      {current.title}
                    </h1>
                    <p style={{ fontSize: '13px', color: '#888888', margin: '4px 0 0' }}>{current.sub}</p>
                  </div>
                </div>
                <button
                  onClick={reload}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '8px',
                    border: '1px solid #2A2A2A', background: '#1A1A1A',
                    fontSize: '13px', fontWeight: '500', color: '#888888',
                    cursor: 'pointer', transition: 'background 120ms ease-out',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#222222'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1A1A1A'}
                >
                  ↻ Actualizar
                </button>
              </div>

              {/* Contenido por página */}
              {page === 'overview' && (
                <>
                  <Metrics evals={evals} ramos={ramos} />
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#F0F0F0', marginBottom: '12px' }}>
                    Mapa de carga semanal
                  </div>
                  <Heatmap evals={evals} rColor={rColor} />
                  <ResumenIA ramos={ramosActivos} />
                </>
              )}
              {page === 'evaluaciones' && <EvalList evals={evals} rColor={rColor} />}
              {page === 'ramos'        && <RamoGrid evals={evals} ramos={ramos} rColor={rColor} />}
              {page === 'alertas'      && <Alertas evals={evals} />}
              {page === 'documentos'   && <Documentos docs={docs} ramos={ramos} rColor={rColor} />}
              {page === 'docentes'     && <Docentes docentes={docentes} />}
            </>
          )}
        </div>
      </main>

      <QRFormButton />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}
