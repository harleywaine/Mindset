'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Account() {
  const router = useRouter()
  const { user, signOut, loading } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      const supabase = createClient()
      
      // Sign out from Supabase
      await signOut()
      
      // Clear any remaining session data
      await supabase.auth.signOut()
      
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
      
      // Force a router refresh and navigate to login
      router.refresh()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-medium mb-1">Account</h1>
        <p className="text-gray-400">Manage your account settings</p>
      </header>

      {/* User Info */}
      <div className="p-4 rounded-lg bg-[#23262A] space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-medium">Profile</h2>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Account Status</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm">
              {user?.email_confirmed_at ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => router.push('/account/settings')}
          className="w-full py-4 px-4 rounded-lg bg-[#23262A] text-white font-medium hover:bg-[#2a2d31] transition-colors flex items-center justify-between"
          disabled={isSigningOut}
        >
          <span>Settings</span>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full py-4 px-4 rounded-lg bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigningOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>

      {/* Version Info */}
      <div className="pt-6 text-center">
        <p className="text-sm text-gray-400">Version 1.0.0</p>
      </div>
    </div>
  )
} 