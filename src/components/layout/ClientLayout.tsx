'use client'

import { usePathname } from 'next/navigation'
import BottomNav from "./BottomNav"

const AUTH_PATHS = ['/login', '/signup', '/auth/callback']

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = AUTH_PATHS.includes(pathname)

  return (
    <div className="flex-1 flex flex-col">
      <main className={`flex-1 px-4 pb-4 ${!isAuthPage ? 'pt-[10vh]' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <BottomNav />}
    </div>
  )
} 