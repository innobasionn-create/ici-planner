import { badge } from '@/lib/utils'
import { T } from '@/lib/theme'
import { Pill } from './ui'

export function DaysBadge({ days }) {
  const b = badge(days)
  return (
    <Pill
      tone={b.tone === 'accent' ? 'accent' : 'neutral'}
      withDot={b.tone === 'accent'}
      style={{ fontFamily: T.font.mono, fontWeight: 500, ...(b.tone === 'muted' ? { color: T.color.muted } : null) }}
    >
      {b.txt}
    </Pill>
  )
}

export function NivelBadge({ nivel }) {
  return (
    <Pill tone={nivel.tone} withDot={nivel.tone === 'accent'}>
      {nivel.lbl}
    </Pill>
  )
}
