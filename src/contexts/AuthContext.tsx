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
    try {
      if (newSession?.user.id !== user?.id) {
        setSession(newSession)
        setUser(newSession?.user ?? null)
      }
    } catch (error) {
      console.warn('Error handling auth state change:', error)
    }
  }, [user?.id])

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        
        if (mounted) {
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.warn('Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange)

    // Initialize
    initializeAuth()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [handleAuthStateChange])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      return { error: null, data }
    } catch (error: any) {
      console.warn('Sign in error:', error)
      return { error, data: null }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
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