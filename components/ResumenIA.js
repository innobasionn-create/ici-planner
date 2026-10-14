'use client'
import { useState } from 'react'
import { Sparkles, RefreshCw, LoaderCircle } from 'lucide-react'
import { T, darkCard } from '@/lib/theme'
import { Button, Icon } from './ui'

const c = T.color

export default function ResumenIA({ ramos: ramosProp }) {
  const [resumen,  setResumen]  = useState('')
  const [cargando, setCargando] = useState(false)
  const [esError,  setEsError]  = useState(false)
  const [generado, setGenerado] = useState(false)

  const getRamos = () =>
    ramosProp !== undefined
      ? ramosProp
      : JSON.parse(localStorage.getItem('ici-ramos-activos') || '[]')

  const generar = () => {
    const ramos = getRamos()

    if (!ramos.length) {
      setResumen('Selecciona tus ramos activos primero.')
      setGenerado(true)
      return
    }

    setCargando(true)
    setEsError(false)

    const params = new URLSearchParams({ ramos: ramos.join(',') })

    fetch(`/api/resumen?${params}`)
      .then(r => r.json())
      .then(data => {
        setResumen(data.resumen || 'Sin resumen disponible.')
        setEsError(!!data.error)
        setGenerado(true)
      })
      .catch(() => {
        setResumen('No se pudo cargar el resumen. Intenta más tarde.')
        setEsError(true)
        setGenerado(true)
      })
      .finally(() => setCargando(false))
  }

  return (
    <section className="pl-card pl-enter" style={{ ...darkCard, animationDelay: '240ms', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span style={{
        alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, height: 28, padding: '0 12px',
        border: `1px solid ${c.inkLine}`, borderRadius: T.radius.pill,
        fontFamily: T.font.mono, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.faint,
      }}>
        <Icon as={Sparkles} size={14} />
        Asistente IA
      </span>

      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: c.white }}>Resumen IA</h2>

      <div aria-live="polite" style={{ fontSize: 15, lineHeight: 1.65, minHeight: 48 }}>
        {!generado && !cargando ? (
          <p style={{ margin: 0, color: c.faint }}>
            Selecciona tus ramos activos y haz clic en <strong style={{ color: c.white, fontWeight: 600 }}>Generar resumen</strong> para recibir recomendaciones personalizadas de priorización.
          </p>
        ) : cargando ? (
          <div style={{ color: c.faint, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon as={LoaderCircle} size={18} className="pl-spin" />
            Analizando tu carga académica…
          </div>
        ) : (
          <p className="pl-swap-in" style={{ margin: 0, color: esError ? c.accent : c.white, whiteSpace: 'pre-wrap' }}>
            {resumen}
          </p>
        )}
      </div>

      <Button
        variant="accent"
        icon={cargando ? LoaderCircle : generado ? RefreshCw : Sparkles}
        onClick={generar}
        disabled={cargando}
        style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
      >
        {cargando ? 'Generando…' : generado ? 'Regenerar' : 'Generar resumen'}
      </Button>
    </section>
  )
}
