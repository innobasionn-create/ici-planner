// Sistema de diseño de Planicy: tokens + helpers de estilo inline.
// Ningún componente debería tener colores hex sueltos: todo sale de acá.

export const T = {
  color: {
    canvas:     '#E9E7E2', // fondo de página y sidebar (gris cálido)
    surface:    '#FFFFFF', // cards
    subtle:     '#F6F4F0', // filas dentro de cards, inputs, banners
    fill:       '#F1EFEB', // botones secundarios, pills neutras, track de tabs
    fillHover:  '#E7E4DE', // hover del secundario
    track:      '#EDEAE5', // barras de progreso vacías
    trackStrong:'#D6D2CB', // toggle apagado (track sobre canvas no se distingue)
    line:       '#ECE9E4', // divisores 1px
    ink:        '#0B0B0B', // texto principal, botón primario, item activo
    inkHover:   '#262626', // hover del primario
    muted:      '#6B6862', // texto secundario, labels, ejes (el #8A8782 del brief no pasa AA: 3.6:1)
    faint:      '#A8A49D', // placeholders, texto deshabilitado
    white:      '#FFFFFF',
    accent:     '#FF5A1F', // ÚNICO acento
    accentInk:  '#B83D0B', // acento para texto pequeño (AA también sobre accentTint)
    onAccent:   '#0B0B0B', // texto sobre accent: blanco sobre #FF5A1F da 3.1:1, negro 6.3:1
    accentTint: '#FFE9DF', // fondo de badges de acento
    inkSurface: '#0B0B0B', // cards oscuras (asistente IA)
    inkLine:    'rgba(255,255,255,.16)',
    scrim:      'rgba(11,11,11,.32)',
    focusRing:  'rgba(11,11,11,.08)',
  },
  heat: ['#EFEDE8', '#FFE3D5', '#FFC0A0', '#FF8A55', '#FF5A1F'], // 0, 1, 2, 3, 4+
  radius: { pill: 999, card: 24, row: 16, tile: 14, input: 14, cell: 12, logo: 10 },
  shadow: {
    card: '0 1px 2px rgba(20,18,14,.06), 0 10px 30px -8px rgba(20,18,14,.16)',
    pop:  '0 1px 2px rgba(20,18,14,.08), 0 24px 60px -12px rgba(20,18,14,.28)',
    none: 'none',
  },
  font: {
    sans: 'var(--font-geist-sans), system-ui, sans-serif',
    mono: 'var(--font-geist-mono), ui-monospace, monospace',
  },
  space: [4, 8, 12, 16, 24, 32, 48, 64],
  motion: {
    spring: 'cubic-bezier(.2,.9,.3,1.04)',
    out:    'cubic-bezier(.16,1,.3,1)',
    fast: '160ms', base: '260ms', slow: '420ms',
  },
  icon: { stroke: 1.75 },
}

const c = T.color

// Nivel de carga semanal (0..4+) → color de celda y texto.
// El texto va siempre en ink: blanco sobre los naranjos no llega a AA.
export function heatLevel(count) {
  const i = Math.min(count, 4)
  return { bg: T.heat[i], fg: c.ink, i }
}

// ── Tipografía ──────────────────────────────────────────────
export const type = {
  h1:      { fontSize: 44, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05, color: c.ink, margin: 0 },
  h2:      { fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, color: c.ink, margin: 0 },
  title:   { fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3, color: c.ink },
  body:    { fontSize: 15, fontWeight: 500, color: c.ink },
  muted:   { fontSize: 14, fontWeight: 400, color: c.muted, lineHeight: 1.55 },
  eyebrow: { fontFamily: T.font.mono, fontSize: 12, fontWeight: 500, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.08em' },
  kpi:     { fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: c.ink },
  mono:    { fontFamily: T.font.mono, fontSize: 13, fontWeight: 500 },
}

// ── Botones (usar junto a className="pl-btn pl-btn--<variante>") ──
const btnBase = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  height: 44, padding: '0 20px', borderRadius: T.radius.pill, border: 'none',
  fontFamily: T.font.sans, fontSize: 15, fontWeight: 600, lineHeight: 1,
  cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none',
}
export const btn = {
  base:      btnBase, // geometría sola: el color lo pone la clase .pl-btn--<variante>
  primary:   { ...btnBase, background: c.ink, color: c.white },
  secondary: { ...btnBase, background: c.fill, color: c.ink },
  accent:    { ...btnBase, background: c.accent, color: c.onAccent },
  link:      { ...btnBase, height: 'auto', padding: 0, background: 'none', color: c.ink, borderRadius: 0 },
  small:     { height: 36, padding: '0 16px', fontSize: 14 },
  icon:      { ...btnBase, width: 36, height: 36, padding: 0, background: 'transparent', color: c.ink },
}

// ── Superficies ─────────────────────────────────────────────
export const card = {
  background: c.surface, borderRadius: T.radius.card, boxShadow: T.shadow.card, padding: 32,
}
export const row = {
  background: c.subtle, borderRadius: T.radius.row, padding: '16px 20px',
}
export const darkCard = {
  background: c.inkSurface, color: c.white, borderRadius: T.radius.card, padding: 32,
}

export function tile(variant = 'neutral', size = 44) {
  const bg = { neutral: c.fill, primary: c.ink, accent: c.accent }[variant]
  return {
    width: size, height: size, borderRadius: T.radius.tile, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: bg, color: variant === 'neutral' ? c.ink : c.white,
  }
}

// ── Pills / badges ──────────────────────────────────────────
const pillBase = {
  display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 10px',
  borderRadius: T.radius.pill, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', lineHeight: 1,
}
export const pill = {
  neutral: { ...pillBase, background: c.fill, color: c.ink },
  accent:  { ...pillBase, background: c.accentTint, color: c.accentInk },
}
export const dot = (color = c.accent, size = 6) => ({
  width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block',
})

// ── Inputs ──────────────────────────────────────────────────
export const input = {
  height: 48, width: '100%', background: c.surface, border: `1px solid ${c.line}`,
  borderRadius: T.radius.input, padding: '0 16px', fontFamily: T.font.sans,
  fontSize: 15, fontWeight: 500, color: c.ink, outline: 'none',
}

// Variables CSS para app/globals.css (se aplican en <html> desde layout.js).
export const cssVars = {
  '--pl-canvas': c.canvas, '--pl-surface': c.surface, '--pl-subtle': c.subtle,
  '--pl-fill': c.fill, '--pl-fill-hover': c.fillHover, '--pl-line': c.line,
  '--pl-ink': c.ink, '--pl-ink-hover': c.inkHover, '--pl-muted': c.muted,
  '--pl-faint': c.faint, '--pl-white': c.white, '--pl-accent': c.accent,
  '--pl-on-accent': c.onAccent, '--pl-focus-ring': c.focusRing,
  '--pl-fast': T.motion.fast, '--pl-base': T.motion.base, '--pl-slow': T.motion.slow,
  '--pl-out': T.motion.out, '--pl-spring': T.motion.spring,
}

// Animación de entrada escalonada para cards (clase .pl-enter en globals.css).
export const enter = (i = 0) => ({ animationDelay: `${i * 40}ms` })
