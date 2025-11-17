import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Salas USM',
  description: 'MVP para consultar disponibilidad, reservar y gestionar salas en la USM.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
          <nav className="container mx-auto flex gap-6 p-3 text-sm">
          <Link href="/disponibilidad" className="hover:underline">Disponibilidad</Link>
          <Link href="/mis-reservas" className="hover:underline">Mis reservas</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
