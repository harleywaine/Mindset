import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Memory fallback for when storage is not available
const memoryStorage = new Map<string, string>()

interface StorageWrapper {
  type: 'memory' | 'localStorage' | 'sessionStorage'
  storage: Storage | Map<string, string>
}

// Initialize storage with default values
const initializeStorage = (): StorageWrapper => {
  if (typeof window === 'undefined') {
    return {
      type: 'memory',
      storage: memoryStorage
    }
  }

  try {
    // Test if localStorage is available
    window.localStorage.setItem('supabase.test-storage', 'initialized')
    window.localStorage.removeItem('supabase.test-storage')
    return {
      type: 'localStorage',
      storage: window.localStorage
    }
  } catch (e) {
    try {
      // Fallback to sessionStorage
      window.sessionStorage.setItem('supabase.test-storage', 'initialized')
      window.sessionStorage.removeItem('supabase.test-storage')
      return {
        type: 'sessionStorage',
        storage: window.sessionStorage
      }
    } catch (e) {
      console.warn('Browser storage not available, falling back to memory storage')
      return {
        type: 'memory',
        storage: memoryStorage
      }
    }
  }
}

// Initialize storage early
const { type: storageType, storage: storageImpl } = initializeStorage()
console.log('[Storage Debug] Using storage type:', storageType)

// Enhanced storage implementation with memory fallback
const enhancedStorage = {
  getItem: (key: string): string | null => {
    try {
      if (storageType === 'memory') {
        return memoryStorage.get(key) || null
      }
      const storage = storageImpl as Storage
      const value = storage.getItem(key)
      if (value) {
        // Ensure memory backup is in sync
        memoryStorage.set(key, value)
      }
      return value
    } catch (error) {
      console.warn('[Storage Debug] Error getting item:', key, error)
      return memoryStorage.get(key) || null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (storageType === 'memory') {
        memoryStorage.set(key, value)
        return
      }
      const storage = storageImpl as Storage
      storage.setItem(key, value)
      // Always keep memory backup
      memoryStorage.set(key, value)
    } catch (error) {
      console.warn('[Storage Debug] Error setting item:', key, error)
      memoryStorage.set(key, value)
    }
  },
  removeItem: (key: string): void => {
    try {
      if (storageType === 'memory') {
        memoryStorage.delete(key)
        return
      }
      const storage = storageImpl as Storage
      storage.removeItem(key)
      memoryStorage.delete(key)
    } catch (error) {
      console.warn('[Storage Debug] Error removing item:', key, error)
      memoryStorage.delete(key)
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