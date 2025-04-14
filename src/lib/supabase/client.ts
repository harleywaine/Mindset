import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Memory fallback for when storage is not available
const memoryStorage = new Map<string, string>()

// Initialize storage with default values
const initializeStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      // Set a test value to check if storage is working
      window.sessionStorage.setItem('supabase.test-storage', 'initialized')
      window.sessionStorage.removeItem('supabase.test-storage')
      return window.sessionStorage
    } catch {
      console.warn('SessionStorage not available, falling back to memory storage')
    }
  }
  return null
}

// Initialize storage early
const storageImpl = initializeStorage()

// Enhanced storage implementation with memory fallback
const enhancedStorage = {
  getItem: (key: string) => {
    try {
      if (storageImpl) {
        const value = storageImpl.getItem(key)
        if (value !== null) return value
      }
      return memoryStorage.get(key) || null
    } catch {
      return memoryStorage.get(key) || null
    }
  },
  setItem: (key: string, value: string) => {
    try {
      if (storageImpl) {
        storageImpl.setItem(key, value)
      }
      memoryStorage.set(key, value)
    } catch {
      memoryStorage.set(key, value)
    }
  },
  removeItem: (key: string) => {
    try {
      if (storageImpl) {
        storageImpl.removeItem(key)
      }
      memoryStorage.delete(key)
    } catch {
      memoryStorage.delete(key)
    }
  },
  length: 0, // Required by Supabase but not used
  key: () => null, // Required by Supabase but not used
}

// Create the Supabase client with enhanced storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: enhancedStorage,
    persistSession: true,
    detectSessionInUrl: false,
    autoRefreshToken: true,
    flowType: 'pkce',
    debug: true, // Enable debug for all environments temporarily
    storageKey: 'supabase.auth.token'
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
    fetch: (...args) => {
      return fetch(...args)
        .catch(err => {
          console.warn('Supabase fetch error:', err)
          throw err
        })
    }
  }
}) 