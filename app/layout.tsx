import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

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
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
