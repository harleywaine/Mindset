import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nbbizrkpeadukjbtnazf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iYml6cmtwZWFkdWtqYnRuYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjEwMTksImV4cCI6MjA1OTU5NzAxOX0.pNsmMEq04GVPTxjWjdbv-02CNzneDMJUi9byMwskn1E'

let client: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function createClient() {
  if (client) return client

  try {
    client = createClientComponentClient<Database>({
      supabaseUrl,
      supabaseKey: supabaseAnonKey
    })
    return client
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    throw new Error('Failed to create Supabase client')
  }
} 