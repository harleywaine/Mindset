import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a custom storage implementation that works with privacy-focused browsers
const createCustomStorage = () => {
  try {
    return {
      getItem: (key: string) => {
        try {
          const item = window.sessionStorage.getItem(key)
          return item
        } catch {
          return null
        }
      },
      setItem: (key: string, value: string) => {
        try {
          window.sessionStorage.setItem(key, value)
        } catch {
          console.warn('Session storage not available')
        }
      },
      removeItem: (key: string) => {
        try {
          window.sessionStorage.removeItem(key)
        } catch {
          console.warn('Session storage not available')
        }
      }
    }
  } catch {
    // Fallback for server-side rendering
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    }
  }
}

// Initialize Supabase with session storage and better config for Vercel
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createCustomStorage(),
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    autoRefreshToken: true,
    debug: process.env.NODE_ENV === 'development'
  },
  global: {
    headers: {
      'X-Client-Info': 'meditation-app'
    }
  }
}) 