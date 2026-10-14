'use client'
import { useState } from 'react'
import { ClipboardList, FileQuestion, BookOpen, FileText, Paperclip, ChevronDown, ArrowUpRight, FolderOpen } from 'lucide-react'
import { T, type } from '@/lib/theme'
import { Card, Pill, Icon, IconTile, Empty } from './ui'

const c = T.color

const TIPO_ICONS = {
  'Pauta':              ClipboardList,
  'Certamen anterior':  FileQuestion,
  'Guia de ejercicios': BookOpen,
  'Guía de ejercicios': BookOpen,
  'Apunte':             FileText,
  'Otro':               Paperclip,
}

export function Documentos({ docs, ramos }) {
  const [openRamos, setOpenRamos] = useState(new Set())

  const toggle = ramo => {
    setOpenRamos(prev => {
      const next = new Set(prev)
      if (next.has(ramo)) next.delete(ramo)
      else next.add(ramo)
      return next
    })
  }

  if (docs.length === 0) {
    return (
      <Card enter={0}>
        <Empty icon={FolderOpen}>Sin documentos aun. Se el primero en agregar uno!</Empty>
      </Card>
    )
  }

  const porRamo = {}
  docs.forEach(d => {
    if (!porRamo[d.ramo]) porRamo[d.ramo] = []
    porRamo[d.ramo].push(d)
  })

  const ramosOrdenados = ramos
    .map(r => r.name)
    .filter(name => porRamo[name])

  Object.keys(porRamo).forEach(name => {
    if (!ramosOrdenados.includes(name)) ramosOrdenados.push(name)
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {ramosOrdenados.map((ramo, idx) => {
        const isOpen = openRamos.has(ramo)
        const n = porRamo[ramo].length
        return (
          <Card key={ramo} enter={idx} className="pl-card--flush" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header colapsable */}
            <button
              type="button"
              onClick={() => toggle(ramo)}
              aria-expanded={isOpen}
              className="pl-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 16, width: '100%', padding: '20px 24px',
                border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <IconTile icon={FileText} />
              <div style={{ ...type.title, flex: 1, minWidth: 0 }}>{ramo}</div>
              <Pill style={{ fontFamily: T.font.mono, fontWeight: 500 }}>
                {n} documento{n !== 1 ? 's' : ''}
              </Pill>
              <Icon as={ChevronDown} size={20} style={{
                color: c.muted,
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: `transform ${T.motion.base} ${T.motion.spring}`,
              }} />
            </button>

            {/* Grid desplegable */}
            <div style={{
              display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr',
              transition: `grid-template-rows ${T.motion.base} ${T.motion.out}`,
            }}>
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                  gap: 12, padding: '0 24px 24px',
                }}>
                  {porRamo[ramo].map((doc, i) => (
                    <a
                      key={i}
                      href={doc.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isOpen ? 0 : -1}
                      className="pl-row"
                      style={{
                        display: 'flex', flexDirection: 'column', gap: 12, padding: 20,
                        borderRadius: T.radius.row, textDecoration: 'none', color: c.ink,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <IconTile icon={TIPO_ICONS[doc.tipo] || Paperclip} size={40} iconSize={18} style={{ background: c.surface }} />
                        <Pill style={{ background: c.surface }}>{doc.tipo}</Pill>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.35 }}>{doc.titulo}</div>
                      {doc.autor && <div style={{ fontSize: 14, color: c.muted }}>{doc.autor}</div>}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, marginTop: 'auto' }}>
                        Abrir <Icon as={ArrowUpRight} size={16} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
