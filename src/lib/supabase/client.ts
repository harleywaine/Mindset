import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  try {
    client = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          flowType: 'pkce',
          persistSession: true,
          detectSessionInUrl: true,
          storage: {
            getItem: (key) => {
              if (typeof window === 'undefined') return null
              return window.localStorage.getItem(key)
            },
            setItem: (key, value) => {
              if (typeof window === 'undefined') return
              window.localStorage.setItem(key, value)
            },
            removeItem: (key) => {
              if (typeof window === 'undefined') return
              window.localStorage.removeItem(key)
            }
          },
          autoRefreshToken: true,
          debug: process.env.NODE_ENV === 'development'
        },
        cookies: {
          get(name: string) {
            if (typeof window === 'undefined') return ''
            const cookie = document.cookie
              .split(';')
              .find((c) => c.trim().startsWith(name + '='))
            if (!cookie) return ''
            const value = cookie.split('=')[1]
            return decodeURIComponent(value)
          },
          set(name: string, value: string, options: { path: string }) {
            if (typeof window === 'undefined') return
            const encodedValue = encodeURIComponent(value)
            let cookie = name + '=' + encodedValue
            if (options.path) cookie += '; path=' + options.path
            cookie += '; SameSite=Lax; secure'
            document.cookie = cookie
          },
          remove(name: string, options: { path: string }) {
            if (typeof window === 'undefined') return
            document.cookie = name + '=; path=' + options.path + '; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          }
        }
      }
    )
    return client
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    throw error
  }
} 