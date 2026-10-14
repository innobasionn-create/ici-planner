'use client'
import { useLayoutEffect, useRef, useState } from 'react'
import { T, btn, card, pill, tile, dot, input } from '@/lib/theme'

const c = T.color

// Un solo set (Lucide) y un solo grosor en toda la app.
export function Icon({ as: Comp, size = 18, style, ...rest }) {
  return <Comp size={size} strokeWidth={T.icon.stroke} aria-hidden="true" style={{ flexShrink: 0, ...style }} {...rest} />
}

export function Button({ variant = 'primary', size, icon, iconRight, as: Tag = 'button', children, style, className = '', ...rest }) {
  const geom = variant === 'link' ? btn.link : { ...btn.base, ...(size === 'sm' ? btn.small : null) }
  return (
    <Tag
      className={`pl-btn pl-btn--${variant} ${className}`}
      style={{ ...geom, background: undefined, color: undefined, ...style }}
      {...(Tag === 'button' && !rest.type ? { type: 'button' } : null)}
      {...rest}
    >
      {icon && <Icon as={icon} size={size === 'sm' ? 16 : 18} />}
      {children}
      {iconRight && <Icon as={iconRight} size={size === 'sm' ? 16 : 18} />}
    </Tag>
  )
}

export function IconButton({ icon, label, size = 36, variant = 'ghost', style, className = '', ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`pl-btn pl-btn--${variant} ${className}`}
      style={{ ...btn.icon, background: undefined, color: undefined, width: size, height: size, position: 'relative', ...style }}
      {...rest}
    >
      <Icon as={icon} size={18} />
      {rest.children}
    </button>
  )
}

export function Card({ children, style, enter, as: Tag = 'div', className = '', ...rest }) {
  return (
    <Tag
      className={`pl-card ${enter !== undefined ? 'pl-enter' : ''} ${className}`}
      style={{ ...card, ...(enter !== undefined ? { animationDelay: `${enter * 40}ms` } : null), ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function Eyebrow({ children, style, ...rest }) {
  return (
    <div
      style={{ fontFamily: T.font.mono, fontSize: 12, fontWeight: 500, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.08em', ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}

export function Pill({ tone = 'neutral', withDot, icon, children, style }) {
  return (
    <span style={{ ...pill[tone], ...style }}>
      {withDot && <span style={dot(tone === 'accent' ? c.accent : c.ink)} />}
      {icon && <Icon as={icon} size={14} />}
      {children}
    </span>
  )
}

export function IconTile({ icon, variant = 'neutral', size = 44, iconSize = 20, style }) {
  return (
    <div style={{ ...tile(variant, size), ...style }}>
      <Icon as={icon} size={iconSize} />
    </div>
  )
}

export function Input({ icon, style, wrapStyle, height = 48, ...rest }) {
  return (
    <div style={{ position: 'relative', width: '100%', ...wrapStyle }}>
      {icon && (
        <Icon as={icon} size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: c.muted, pointerEvents: 'none' }} />
      )}
      <input
        className="pl-input"
        style={{ ...input, height, ...(icon ? { paddingLeft: 44 } : null), ...style }}
        {...rest}
      />
    </div>
  )
}

// visual: solo dibuja el switch (para usarlo dentro de una fila que ya es botón).
export function Toggle({ on, onChange, size = 'md', label, visual }) {
  const [w, h] = size === 'sm' ? [32, 20] : [44, 26]
  const k = h - 6
  const Tag = visual ? 'span' : 'button'
  const a11y = visual
    ? { 'aria-hidden': true }
    : { type: 'button', role: 'switch', 'aria-checked': on, 'aria-label': label, onClick: onChange, className: 'pl-btn' }
  return (
    <Tag
      {...a11y}
      style={{
        display: 'inline-block',
        width: w, height: h, borderRadius: T.radius.pill, border: 'none', padding: 0, flexShrink: 0,
        background: on ? c.ink : c.trackStrong, position: 'relative', cursor: 'pointer',
        transition: `background-color ${T.motion.fast} ease-out`,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: 3, width: k, height: k, borderRadius: '50%',
        background: c.white, boxShadow: '0 1px 2px rgba(20,18,14,.2)',
        transform: `translateX(${on ? w - h : 0}px)`,
        transition: `transform ${T.motion.base} ${T.motion.spring}`,
      }} />
    </Tag>
  )
}

// Indicador deslizante: mide el elemento activo dentro de un contenedor.
export function useSlider(activeKey, axis = 'x') {
  const wrap = useRef(null)
  const items = useRef({})
  const [box, setBox] = useState(null)
  useLayoutEffect(() => {
    const measure = () => {
      const el = items.current[activeKey]
      if (!el || !wrap.current) return setBox(null)
      setBox(axis === 'x'
        ? { left: el.offsetLeft, width: el.offsetWidth, top: el.offsetTop, height: el.offsetHeight }
        : { top: el.offsetTop, height: el.offsetHeight, left: el.offsetLeft, width: el.offsetWidth })
    }
    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (ro && wrap.current) ro.observe(wrap.current)
    return () => ro && ro.disconnect()
  }, [activeKey, axis])
  const ref = key => el => { items.current[key] = el }
  return { wrap, ref, box }
}

export function Segmented({ options, value, onChange, style }) {
  const { wrap, ref, box } = useSlider(value)
  return (
    <div
      ref={wrap}
      role="tablist"
      style={{
        position: 'relative', display: 'inline-flex', maxWidth: '100%', overflowX: 'auto',
        padding: 4, gap: 0, background: c.fill, borderRadius: T.radius.pill, ...style,
      }}
    >
      {box && (
        <span aria-hidden="true" style={{
          position: 'absolute', top: 4, bottom: 4, left: box.left, width: box.width,
          background: c.ink, borderRadius: T.radius.pill,
          transition: `left ${T.motion.base} ${T.motion.spring}, width ${T.motion.base} ${T.motion.spring}`,
        }} />
      )}
      {options.map(o => {
        const active = o.id === value
        return (
          <button
            key={o.id}
            ref={ref(o.id)}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.id)}
            className="pl-btn"
            style={{
              position: 'relative', zIndex: 1, height: 36, padding: '0 16px', border: 'none',
              borderRadius: T.radius.pill, background: 'transparent', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
              color: active ? c.white : c.ink,
              transition: `color ${T.motion.base} ${T.motion.out}`,
            }}
          >
            {o.label}
            {o.count !== undefined && (
              <span style={{ fontFamily: T.font.mono, fontWeight: 500, marginLeft: 6, opacity: active ? .7 : .55 }}>
                · {o.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function Avatar({ name, size = 44 }) {
  const partes = name.trim().split(/\s+/)
  const ini = ((partes[0]?.[0] || '') + (partes[1]?.[0] || '')).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0, background: c.fill, color: c.ink,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.34), fontWeight: 600, letterSpacing: '-0.01em',
    }}>
      {ini}
    </div>
  )
}

// Estado vacío dentro de una card.
export function Empty({ icon, children }) {
  return (
    <div style={{ padding: '48px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
      {icon && <IconTile icon={icon} />}
      <div style={{ fontSize: 15, color: c.muted, maxWidth: 360 }}>{children}</div>
    </div>
  )
}
