import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Viz. - Creative Community Platform',
  description: 'A creative community platform where users can create quotable digital content and publish editorials recommending other users\' content.',
  keywords: ['creative', 'community', 'content', 'editorial', 'quotable'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
