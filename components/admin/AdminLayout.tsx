'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Design', href: '/admin/design', icon: '🎨' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Content', href: '/admin/content', icon: '📷' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { name: 'Activity Logs', href: '/admin/logs', icon: '📝' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white border-b border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Viz. Admin Panel</h1>
            <span className="px-3 py-1 text-xs font-medium bg-blue-600 rounded-full">
              ADMIN
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              {session?.user?.username}
            </span>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              ← Exit Admin
            </Link>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
