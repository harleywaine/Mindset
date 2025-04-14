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
  const [initialized, setInitialized] = useState(false)

  // Handle auth state updates
  const handleAuthStateChange = useCallback(async (_event: string, newSession: Session | null) => {
    if (!initialized) return
    
    try {
      if (newSession?.user.id !== user?.id) {
        setSession(newSession)
        setUser(newSession?.user ?? null)
      }
    } catch (error) {
      console.warn('Error handling auth state change:', error)
    }
  }, [user?.id, initialized])

  // Initialize auth state
  useEffect(() => {
    let mounted = true
    let retryCount = 0
    const maxRetries = 3

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        
        if (mounted) {
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
          setLoading(false)
          setInitialized(true)
        }
      } catch (error) {
        console.warn('Error initializing auth:', error)
        if (mounted && retryCount < maxRetries) {
          retryCount++
          // Exponential backoff for retries
          setTimeout(initializeAuth, Math.pow(2, retryCount) * 1000)
        } else if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    // Initialize
    initializeAuth()

    // Set up auth state listener only after initialization
    let subscription: { unsubscribe: () => void } | null = null
    if (initialized) {
      const { data } = supabase.auth.onAuthStateChange(handleAuthStateChange)
      subscription = data.subscription
    }

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [handleAuthStateChange])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error

      // Force a page reload after successful sign-in
      if (data?.user) {
        window.location.href = '/'
        return { error: null, data }
      }
      
      return { error: null, data }
    } catch (error: any) {
      console.warn('Sign in error:', error)
      return { error, data: null }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.warn('Sign out error:', error)
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