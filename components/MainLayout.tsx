'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Sidebar from './Sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {!isAuthPage && <Sidebar />}
      
      <main className={`pt-16 ${!isAuthPage ? 'pl-20' : ''}`}>
        {children}
      </main>
    </div>
  )
}
