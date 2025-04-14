import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Memory fallback for when storage is not available
const memoryStorage = new Map<string, string>()

// Enhanced storage implementation with memory fallback
const enhancedStorage = {
  getItem: (key: string) => {
    try {
      // Try sessionStorage first
      if (typeof window !== 'undefined') {
        const value = window.sessionStorage.getItem(key)
        if (value !== null) return value
      }
      // Fall back to memory storage
      return memoryStorage.get(key) || null
    } catch {
      // If all else fails, try memory storage
      return memoryStorage.get(key) || null
    }
  },
  setItem: (key: string, value: string) => {
    try {
      // Try to use sessionStorage
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, value)
      }
      // Always set in memory as backup
      memoryStorage.set(key, value)
    } catch {
      // If sessionStorage fails, just use memory
      memoryStorage.set(key, value)
    }
  },
  removeItem: (key: string) => {
    try {
      // Try to remove from sessionStorage
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key)
      }
      // Always remove from memory
      memoryStorage.delete(key)
    } catch {
      // If sessionStorage fails, just remove from memory
      memoryStorage.delete(key)
    }
  }
}

// Create the Supabase client with enhanced storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: enhancedStorage,
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development'
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        console.warn('Supabase fetch error:', err)
        throw err
      })
    }
  }
}) 