import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = 'https://nbbizrkpeadukjbtnazf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iYml6cmtwZWFkdWtqYnRuYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjEwMTksImV4cCI6MjA1OTU5NzAxOX0.pNsmMEq04GVPTxjWjdbv-02CNzneDMJUi9byMwskn1E'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  try {
    client = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        },
        global: {
          headers: {
            'x-application-name': 'meditation-app'
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