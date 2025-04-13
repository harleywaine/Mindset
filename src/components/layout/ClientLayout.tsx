'use client'

import BottomNav from "./BottomNav"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 px-4 pb-4" style={{ paddingTop: '10vh' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
} 