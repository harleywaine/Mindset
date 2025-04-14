import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Memory fallback for when storage is not available
const memoryStorage = new Map<string, string>()

// Pre-initialize cache with empty values
const CACHE_KEYS = [
  'supabase.auth.token',
  'supabase.auth.refreshToken',
  'supabase.auth.user'
]

// Initialize storage with default values
const initializeStorage = () => {
  const storage = typeof window !== 'undefined' ? window.localStorage : null
  
  if (!storage) {
    // Initialize memory storage with empty values
    CACHE_KEYS.forEach(key => memoryStorage.set(key, ''))
    return memoryStorage
  }

  try {
    // Pre-initialize cache keys
    CACHE_KEYS.forEach(key => {
      if (!storage.getItem(key)) {
        storage.setItem(key, '')
      }
    })
    return storage
  } catch (e) {
    console.warn('Storage not available, using memory storage')
    CACHE_KEYS.forEach(key => memoryStorage.set(key, ''))
    return memoryStorage
  }
}

// Initialize storage early
const storageImpl = initializeStorage()
console.log('[Storage Debug] Storage initialized')

// Enhanced storage implementation with memory fallback
const enhancedStorage = {
  getItem: (key: string): string | null => {
    try {
      if (storageImpl instanceof Map) {
        return memoryStorage.get(key) || null
      }
      const value = storageImpl.getItem(key)
      return value || memoryStorage.get(key) || null
    } catch (error) {
      console.warn('[Storage Debug] Error getting item:', key, error)
      return memoryStorage.get(key) || null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      // Always set in memory first
      memoryStorage.set(key, value)
      
      if (!(storageImpl instanceof Map)) {
        storageImpl.setItem(key, value)
      }
    } catch (error) {
      console.warn('[Storage Debug] Error setting item:', key, error)
    }
  },
  removeItem: (key: string): void => {
    try {
      memoryStorage.delete(key)
      if (!(storageImpl instanceof Map)) {
        storageImpl.removeItem(key)
      }
    } catch (error) {
      console.warn('[Storage Debug] Error removing item:', key, error)
    }
  },
  length: 0,
  key: () => null,
}

// Create the Supabase client with enhanced storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: enhancedStorage,
    persistSession: true,
    detectSessionInUrl: false,
    autoRefreshToken: true,
    flowType: 'pkce',
    debug: true,
    storageKey: 'supabase.auth.token'
  },
  global: {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    }
  }
}) 