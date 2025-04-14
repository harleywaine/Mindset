import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Memory storage implementation
class MemoryStorage {
  private store: Map<string, string>
  
  constructor() {
    this.store = new Map()
  }

  getItem(key: string) {
    return this.store.get(key) || null
  }

  setItem(key: string, value: string) {
    this.store.set(key, value)
  }

  removeItem(key: string) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }

  key() {
    return null
  }

  get length() {
    return this.store.size
  }
}

// Create a hybrid storage that works in all contexts
const createHybridStorage = () => {
  const memoryStore = new MemoryStorage()
  
  // Check if we're in a browser context
  const isBrowser = typeof window !== 'undefined'
  
  // Try to use localStorage, fallback to memory
  const primaryStorage = isBrowser ? window.localStorage : memoryStore

  return {
    getItem: (key: string): string | null => {
      try {
        // Always try primary storage first
        const value = primaryStorage.getItem(key)
        if (value !== null) {
          // Sync to memory
          memoryStore.setItem(key, value)
          return value
        }
        // Fallback to memory store
        return memoryStore.getItem(key)
      } catch {
        return memoryStore.getItem(key)
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        // Always set in memory first
        memoryStore.setItem(key, value)
        // Try to set in primary storage
        primaryStorage.setItem(key, value)
      } catch (e) {
        console.warn('Error setting storage item:', e)
      }
    },
    removeItem: (key: string): void => {
      try {
        memoryStore.removeItem(key)
        primaryStorage.removeItem(key)
      } catch (e) {
        console.warn('Error removing storage item:', e)
      }
    },
    // Required properties for Storage interface
    length: 0,
    key: (_index: number) => null,
    clear: () => {
      try {
        memoryStore.clear()
        if (primaryStorage !== memoryStore) {
          primaryStorage.clear()
        }
      } catch (e) {
        console.warn('Error clearing storage:', e)
      }
    }
  }
}

// Create storage instance
const hybridStorage = createHybridStorage()

// Initialize Supabase with minimal config first
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: hybridStorage,
    persistSession: true,
    detectSessionInUrl: false,
    autoRefreshToken: true,
    flowType: 'pkce',
    debug: true,
    storageKey: 'supabase.auth.token'
  }
})

// Initialize storage with default session if needed
if (typeof window !== 'undefined') {
  // Ensure storage is initialized in client context
  const initializeStorage = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Store session data
        hybridStorage.setItem('supabase.auth.token', session.access_token)
        if (session.refresh_token) {
          hybridStorage.setItem('supabase.auth.refreshToken', session.refresh_token)
        }
        hybridStorage.setItem('supabase.auth.user', JSON.stringify(session.user))
      } else {
        // Initialize with empty values to prevent "not initialized" errors
        hybridStorage.setItem('supabase.auth.token', '')
        hybridStorage.setItem('supabase.auth.refreshToken', '')
        hybridStorage.setItem('supabase.auth.user', '')
      }
    } catch (error) {
      console.warn('Error initializing storage:', error)
      // Set empty values as fallback
      hybridStorage.setItem('supabase.auth.token', '')
      hybridStorage.setItem('supabase.auth.refreshToken', '')
      hybridStorage.setItem('supabase.auth.user', '')
    }
  }

  // Run initialization
  initializeStorage()
} 