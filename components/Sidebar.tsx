'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  {
    name: 'Viz.Edit',
    href: '/create',
    icon: '/images/edit-icon.svg',
    description: 'Create content',
  },
  {
    name: 'Stamp',
    href: '/approvals',
    icon: '/images/edit-icon.svg', // Placeholder - will use edit icon for now
    description: 'Approval notifications',
  },
  {
    name: 'Viz.List',
    href: '/saved',
    icon: '/images/vizlist-icon.svg',
    description: 'Saved content',
  },
  {
    name: 'Viz.Let',
    href: '/vizlet',
    icon: '/images/vizlet-icon.svg',
    description: 'E-commerce marketplace',
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-8">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.name}
            href={item.href}
            title={item.description}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-all ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="relative w-8 h-8">
              <Image
                src={item.icon}
                alt={item.name}
                fill
                className={`object-contain ${isActive ? 'brightness-0 invert' : ''}`}
              />
            </div>
            <span className="text-xs mt-1 font-medium">{item.name.split('.')[0]}</span>
          </Link>
        )
      })}
    </aside>
  )
}
