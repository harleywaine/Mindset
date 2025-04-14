'use client'

import { House, Heart, ChartLineUp, User } from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LineChart } from '@phosphor-icons/react'

const navigation = [
  { name: 'Home', href: '/', icon: House },
  { name: 'Emotional Control', href: '/emotional-control', icon: Heart },
  { name: 'Visualization', href: '/visualization', icon: ChartLineUp },
  { name: 'Account', href: '/account', icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1D20] border-t border-[#23262A] px-4 py-2">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <Link 
          href="/" 
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
            pathname === "/" ? "text-[#2B6D79]" : "text-gray-400 hover:text-gray-300"
          )}
        >
          <Home size={24} />
          <span className="text-xs">Home</span>
        </Link>
        <Link 
          href="/emotional-control" 
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
            pathname.includes("emotional-control") ? "text-[#2B6D79]" : "text-gray-400 hover:text-gray-300"
          )}
        >
          <Heart size={24} />
          <span className="text-xs">Emotional</span>
        </Link>
        <Link 
          href="/visualization" 
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
            pathname.includes("visualization") ? "text-[#2B6D79]" : "text-gray-400 hover:text-gray-300"
          )}
        >
          <LineChart size={24} />
          <span className="text-xs">Progress</span>
        </Link>
        <Link 
          href="/account" 
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
            pathname === "/account" ? "text-[#2B6D79]" : "text-gray-400 hover:text-gray-300"
          )}
        >
          <User size={24} />
          <span className="text-xs">Account</span>
        </Link>
      </div>
    </nav>
  )
} 