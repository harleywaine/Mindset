import { createClient } from '@supabase/supabase-js'
import Cookies from 'js-cookie'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a cookie-based storage implementation
const createCookieStorage = () => {
  const STORAGE_KEY = 'sb-auth-token'
  const COOKIE_OPTIONS = {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax' as const,
    path: '/'
  }

  return {
    getItem: (key: string) => {
      try {
        return Cookies.get(key) || null
      } catch {
        return null
      }
    },
    setItem: (key: string, value: string) => {
      try {
        Cookies.set(key, value, COOKIE_OPTIONS)
      } catch (error) {
        console.warn('Cookie storage error:', error)
      }
    },
    removeItem: (key: string) => {
      try {
        Cookies.remove(key, { path: '/' })
      } catch (error) {
        console.warn('Cookie removal error:', error)
      }
    }
  }
}

// Initialize Supabase with cookie storage and minimal config
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createCookieStorage(),
    persistSession: true,
    detectSessionInUrl: false, // Disable URL detection to prevent redirect loops
    autoRefreshToken: true,
    flowType: 'implicit' // Use implicit flow instead of PKCE for better browser support
  },
  global: {
    headers: {
      'X-Client-Info': 'meditation-app'
    }
  }
}) 