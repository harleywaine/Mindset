'use client'

import { House, Heart, ChartLineUp, User } from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Home', href: '/', icon: House },
  { name: 'Emotional Control', href: '/emotional-control', icon: Heart },
  { name: 'Visualization', href: '/visualization', icon: ChartLineUp },
  { name: 'Account', href: '/account', icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-center pb-6">
      <div className="flex w-[calc(100%-2rem)] max-w-[420px] px-3 py-3 justify-between items-center rounded-[80px] border border-white/[0.21] bg-[#1C1E20]">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`p-2.5 rounded-full transition-all ${
                isActive 
                  ? 'bg-[#2B6D79]/90 text-white' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.05]'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <item.icon size={24} weight="light" />
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 