import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { cssVars } from '@/lib/theme'
import './globals.css'

export const metadata = {
  title: 'Planicy · ICI Planner',
  description: 'Dashboard académico colaborativo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`} style={cssVars}>
      <body>{children}</body>
    </html>
  )
}
