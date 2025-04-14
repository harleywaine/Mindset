'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    initialized: false
  })
  const router = useRouter()

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

          // If we have a session and we're on the login page, redirect to home
          if (session?.user && window.location.pathname.includes('/login')) {
            console.log('Redirecting authenticated user from login to home')
            window.location.href = '/'
          }
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

        // Handle auth state changes
        if (event === 'SIGNED_IN') {
          console.log('User signed in, redirecting to home')
          window.location.href = '/'
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, redirecting to login')
          window.location.href = '/login'
        }
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
      // Redirect will be handled by onAuthStateChange
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
      // Redirect will be handled by onAuthStateChange
    } catch (error) {
      console.error('Sign out error:', error)
      setState(prev => ({ ...prev, error: error as AuthError }))
      throw error
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  // Add debug output for state changes
  useEffect(() => {
    console.log('Auth state updated:', {
      user: state.user ? 'exists' : 'null',
      loading: state.loading,
      initialized: state.initialized,
      error: state.error
    })
  }, [state])

  // Don't render children until auth is initialized
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