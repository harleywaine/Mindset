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
    console.log('Initializing auth...')

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('Getting session...')
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

        console.log('Session retrieved:', session ? 'exists' : 'none')
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'session exists' : 'no session')
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
      console.log('Cleaning up auth...')
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Handle route protection
  useEffect(() => {
    if (!state.initialized || state.loading) return

    const isPublicPath = PUBLIC_PATHS.some(path => pathname?.startsWith(path))
    
    if (state.user && isPublicPath) {
      console.log('Authenticated user accessing public path, redirecting to home')
      router.replace('/')
    } else if (!state.user && !isPublicPath && pathname !== '/') {
      console.log('Unauthenticated user accessing protected path, redirecting to login')
      router.replace('/login')
    }
  }, [state.user, state.initialized, state.loading, pathname, router])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in...')
      setState(prev => ({ ...prev, loading: true, error: null }))
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error('Sign in error:', error)
        throw error
      }
      console.log('Sign in successful:', data.user?.email)
      router.refresh()
    } catch (error) {
      console.error('Sign in error:', error)
      setState(prev => ({ ...prev, error: error as AuthError }))
      throw error
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const signOut = async () => {
    try {
      console.log('Attempting sign out...')
      setState(prev => ({ ...prev, loading: true, error: null }))
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
      console.log('Sign out successful')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
      setState(prev => ({ ...prev, error: error as AuthError }))
      throw error
    } finally {
      setState(prev => ({ ...prev, loading: false }))
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