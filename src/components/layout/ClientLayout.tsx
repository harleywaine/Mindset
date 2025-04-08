'use client'

import { AuthProvider } from "@/contexts/AuthContext"
import BottomNav from "./BottomNav"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-4 pb-4" style={{ paddingTop: '10vh' }}>
          {children}
        </main>
      </div>
      <BottomNav />
    </AuthProvider>
  )
} 