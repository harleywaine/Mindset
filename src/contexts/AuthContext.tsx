'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: Error }>
  signUp: (email: string, password: string) => Promise<{ error?: Error }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useRef(createClient())
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')
        const { data: { session: currentSession }, error } = await supabase.current.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          throw error
        }
        
        if (mounted.current) {
          console.log('Setting initial session:', currentSession?.user?.email)
          if (currentSession) {
            setUser(currentSession.user)
            setSession(currentSession)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted.current) {
          setUser(null)
          setSession(null)
          setLoading(false)
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.current.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email)
        if (mounted.current) {
          if (currentSession) {
            setUser(currentSession.user)
            setSession(currentSession)
          } else {
            setUser(null)
            setSession(null)
          }
          setLoading(false)
        }
      }
    )

    return () => {
      mounted.current = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Signing up user:', email)
      const { data, error } = await supabase.current.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('Sign up error:', error)
        return { error }
      }

      console.log('Sign up successful:', data)
      return {}
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: error as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email)
      const { data, error } = await supabase.current.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }

      if (mounted.current) {
        console.log('Sign in successful:', data.user?.email)
        setUser(data.user)
        setSession(data.session)
      }
      return {}
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out user:', user?.email)
      const { error } = await supabase.current.auth.signOut()
      if (error) throw error
      
      if (mounted.current) {
        console.log('Sign out successful')
        setUser(null)
        setSession(null)
      }
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
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