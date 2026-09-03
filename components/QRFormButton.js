'use client'
import { useState, useMemo } from 'react'
import { QrCode, X, Copy, Check } from 'lucide-react'
import qrcodeGen from 'qrcode-generator'
import { FORM_REGISTRO_URL } from '@/lib/config'

const PENDIENTE = FORM_REGISTRO_URL.includes('REEMPLAZAR')

export function QRFormButton() {
  const [open, setOpen]     = useState(false)
  const [copiado, setCopiado] = useState(false)

  const svg = useMemo(() => {
    const qr = qrcodeGen(0, 'M')
    qr.addData(FORM_REGISTRO_URL)
    qr.make()
    return qr.createSvgTag({ cellSize: 6, margin: 8 })
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
        onClick={() => setOpen(true)}
        aria-label="Mostrar QR del formulario de evaluaciones"
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          zIndex: 250,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '1px solid #2A2A2A',
          background: '#1A1A1A',
          color: '#F0F0F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
          transition: 'background 120ms ease-out, transform 120ms ease-out',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#222222'; e.currentTarget.style.transform = 'scale(1.05)' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#1A1A1A'; e.currentTarget.style.transform = 'scale(1)' }}
      >
        <QrCode size={22} strokeWidth={1.8} />
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 260,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 150ms ease-out',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '340px',
              width: '100%',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#F0F0F0' }}>
                Registrar una evaluación
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#888888', padding: '2px', lineHeight: 1,
                }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '12.5px', color: '#888888', margin: '0 0 16px' }}>
              Escanea el código o comparte el link para sumar una evaluación al curso.
            </p>

            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />

            {PENDIENTE && (
              <div style={{
                fontSize: '11.5px', color: '#C77D1F',
                background: '#2A1F08', border: '1px solid #5C4315',
                borderRadius: '8px', padding: '8px 10px', marginBottom: '12px',
              }}>
                ⚠️ Link pendiente: actualiza <code>FORM_REGISTRO_URL</code> en <code>lib/config.js</code> con el link real del formulario.
              </div>
            )}

            <button
              onClick={copiarLink}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', padding: '9px 14px', borderRadius: '8px',
                border: '1px solid #2A2A2A', background: '#222222',
                fontSize: '13px', fontWeight: '500', color: '#F0F0F0',
                cursor: 'pointer', transition: 'background 120ms ease-out',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2A2A2A'}
              onMouseLeave={e => e.currentTarget.style.background = '#222222'}
            >
              {copiado ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar link</>}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
