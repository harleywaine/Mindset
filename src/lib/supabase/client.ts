import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (client) return client

  try {
    client = createBrowserClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            if (typeof window === 'undefined') return ''
            return document.cookie.split(';').find(row => row.trim().startsWith(`${name}=`))?.split('=')[1] || ''
          },
          set(name: string, value: string, options: { path: string }) {
            if (typeof window === 'undefined') return
            document.cookie = `${name}=${value}; path=${options.path}`
          },
          remove(name: string, options: { path: string }) {
            if (typeof window === 'undefined') return
            document.cookie = `${name}=; path=${options.path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          }
        }
      }
    )
    return client
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    throw new Error('Failed to create Supabase client')
  }
} 