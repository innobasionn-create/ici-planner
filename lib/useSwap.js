'use client'
import { useEffect, useState } from 'react'

// Cambio de contenido sin solapar: blur-out rápido (120ms) y luego blur-in.
// Devuelve el valor que se debe renderizar y la clase de animación; el
// contenedor debe usar key={shown} para que el blur-in se reinicie.
export function useSwap(value) {
  const [shown, setShown] = useState(value)
  const [out, setOut] = useState(false)
  useEffect(() => {
    if (value === shown) return
    setOut(true)
    const t = setTimeout(() => { setShown(value); setOut(false) }, 120)
    return () => clearTimeout(t)
  }, [value, shown])
  return [shown, out ? 'pl-swap-out' : 'pl-swap-in']
}
