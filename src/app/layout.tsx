import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Steno',
  description: 'Speech to text',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="manifest" href="~/manifest.json" />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
