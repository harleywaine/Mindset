import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Custom storage implementation that doesn't rely on localStorage
const customStorage = {
  getItem: (key: string) => {
    try {
      if (typeof window !== 'undefined') {
        return window.sessionStorage.getItem(key)
      }
      return null
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string) => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, value)
      }
    } catch {
      console.warn('Storage not available')
    }
  },
  removeItem: (key: string) => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key)
      }
    } catch {
      console.warn('Storage not available')
    }
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development'
  }
}) 