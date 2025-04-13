import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nbbizrkpeadukjbtnazf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iYml6cmtwZWFkdWtqYnRuYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjEwMTksImV4cCI6MjA1OTU5NzAxOX0.pNsmMEq04GVPTxjWjdbv-02CNzneDMJUi9byMwskn1E'

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
            return document.cookie.split('; ').find(row => row.startsWith(name))?.split('=')[1]
          },
          set(name: string, value: string, options: { path: string }) {
            document.cookie = `${name}=${value}; path=${options.path}`
          },
          remove(name: string, options: { path: string }) {
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