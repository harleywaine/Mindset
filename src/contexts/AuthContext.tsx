'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>
  signOut: () => Promise<void>
  user: User | null
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Handle auth state updates
  const handleAuthStateChange = useCallback(async (_event: string, newSession: Session | null) => {
    console.log('[Auth Debug] Auth state changed:', _event, newSession?.user?.email)
    
    if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    } else if (_event === 'SIGNED_OUT') {
      setSession(null)
      setUser(null)
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Clear any stale data first
        supabase.auth.clearSession()
        
        console.log('[Auth Debug] Initializing auth...')
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.warn('[Auth Debug] Error getting session:', error.message)
          throw error
        }

        if (mounted) {
          console.log('[Auth Debug] Setting initial session:', initialSession?.user?.email)
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.warn('[Auth Debug] Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange)

    // Initialize auth
    initializeAuth()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [handleAuthStateChange])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      console.log('[Auth Debug] Attempting sign in for:', email)
      
      // Clear any existing session first
      await supabase.auth.clearSession()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error

      console.log('[Auth Debug] Sign in successful:', data?.user?.email)
      
      // Wait a moment for the session to be properly established
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (data?.user) {
        window.location.href = '/'
      }
      
      return { error: null, data }
    } catch (error: any) {
      console.warn('[Auth Debug] Sign in error:', error)
      return { error, data: null }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      console.log('[Auth Debug] Signing out...')
      await supabase.auth.clearSession()
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.warn('[Auth Debug] Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    signIn,
    signOut,
    user,
    session,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 