'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'

export function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
} 