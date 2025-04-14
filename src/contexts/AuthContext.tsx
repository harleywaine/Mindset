'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { usePathname, useRouter } from 'next/navigation'

interface AuthState {
  user: User | null
  loading: boolean
  error: AuthError | null
  initialized: boolean
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PUBLIC_PATHS = ['/login', '/signup', '/reset-password']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    initialized: false
  })
  
  const router = useRouter()
  const pathname = usePathname()

  // Handle auth state initialization and changes
  useEffect(() => {
    let mounted = true

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          if (mounted) {
            setState(prev => ({
              ...prev,
              error: sessionError,
              loading: false,
              initialized: true
            }))
          }
          return
        }

        if (mounted) {
          setState(prev => ({
            ...prev,
            user: session?.user ?? null,
            loading: false,
            initialized: true
          }))
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setState(prev => ({
            ...prev,
            error: error as AuthError,
            loading: false,
            initialized: true
          }))
        }
      }
    }

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          loading: false,
          initialized: true
        }))
      }
    })

    // Initialize immediately
    initializeAuth()

    // Cleanup
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Handle route protection with debounce
  useEffect(() => {
    if (!state.initialized || state.loading) return

    const isPublicPath = PUBLIC_PATHS.some(path => pathname?.startsWith(path))
    const shouldRedirect = state.user && isPublicPath ? '/' : !state.user && !isPublicPath && pathname !== '/' ? '/login' : null

    if (shouldRedirect) {
      const timeoutId = setTimeout(() => {
        router.push(shouldRedirect)
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [state.user, state.initialized, state.loading, pathname, router])

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      
      // Let the auth state listener handle the update
      setState(prev => ({ ...prev, loading: false }))
    } catch (error) {
      console.error('Sign in error:', error)
      setState(prev => ({
        ...prev,
        error: error as AuthError,
        loading: false
      }))
      throw error
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Let the auth state listener handle the update
      setState(prev => ({ ...prev, loading: false }))
    } catch (error) {
      console.error('Sign out error:', error)
      setState(prev => ({
        ...prev,
        error: error as AuthError,
        loading: false
      }))
      throw error
    }
  }

  if (!state.initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 