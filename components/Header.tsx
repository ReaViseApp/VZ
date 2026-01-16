'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.svg"
            alt="Viz. Logo"
            width={200}
            height={80}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Auth Buttons */}
        {!isAuthPage && (
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signup"
              className="px-6 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Create An Account
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
