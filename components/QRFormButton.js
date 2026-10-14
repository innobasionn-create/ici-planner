'use client'
import { useState, useMemo } from 'react'
import { QrCode, X, Copy, Check, TriangleAlert } from 'lucide-react'
import qrcodeGen from 'qrcode-generator'
import { FORM_REGISTRO_URL } from '@/lib/config'
import { T, type } from '@/lib/theme'
import { Button, IconButton, Icon } from './ui'

const c = T.color

const PENDIENTE = FORM_REGISTRO_URL.includes('REEMPLAZAR')

export function QRFormButton() {
  const [open, setOpen]     = useState(false)
  const [copiado, setCopiado] = useState(false)

  const svg = useMemo(() => {
    const qr = qrcodeGen(0, 'M')
    qr.addData(FORM_REGISTRO_URL)
    qr.make()
    return qr.createSvgTag({ cellSize: 6, margin: 2 })
  }, [])

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(FORM_REGISTRO_URL)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch (e) {
      // Clipboard no disponible (ej. http sin permisos); no bloquea la UI.
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mostrar QR del formulario de evaluaciones"
        title="Registrar una evaluación"
        className="pl-btn pl-btn--primary pl-fab"
        style={{
          position: 'fixed', right: 24, zIndex: 250, width: 52, height: 52, borderRadius: '50%',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: T.shadow.pop,
        }}
      >
        <Icon as={QrCode} size={22} />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="pl-fade"
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: c.scrim, zIndex: 300,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Registrar una evaluación"
            className="pl-pop"
            onClick={e => e.stopPropagation()}
            style={{
              background: c.surface, borderRadius: T.radius.card, padding: 32, maxWidth: 380, width: '100%',
              boxShadow: T.shadow.pop, display: 'flex', flexDirection: 'column', gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>Registrar una evaluación</div>
                <p style={{ ...type.muted, margin: 0 }}>
                  Escanea el código o comparte el link para sumar una evaluación al curso.
                </p>
              </div>
              <IconButton icon={X} label="Cerrar" onClick={() => setOpen(false)} style={{ marginRight: -8, marginTop: -4 }} />
            </div>

            <div
              style={{ background: c.subtle, borderRadius: T.radius.row, padding: 16, display: 'flex', justifyContent: 'center' }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />

            {PENDIENTE && (
              <div style={{ display: 'flex', gap: 8, fontSize: 13, color: c.accentInk, background: c.accentTint, borderRadius: T.radius.row, padding: '12px 16px' }}>
                <Icon as={TriangleAlert} size={16} style={{ marginTop: 1 }} />
                <span>Link pendiente: actualiza <code>FORM_REGISTRO_URL</code> en <code>lib/config.js</code> con el link real del formulario.</span>
              </div>
            )}

            <Button
              variant={copiado ? 'accent' : 'secondary'}
              icon={copiado ? Check : Copy}
              onClick={copiarLink}
              className={copiado ? 'pl-pop' : ''}
              style={{ width: '100%' }}
            >
              {copiado ? 'Copiado' : 'Copiar link'}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
