import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Memory storage implementation
class MemoryStorage {
  private store: Map<string, string>
  private initialized: boolean
  
  constructor() {
    this.store = new Map()
    this.initialized = false
    this.initializeDefaults()
  }

  private initializeDefaults() {
    // Initialize with empty values to prevent "not initialized" errors
    const defaultKeys = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'supabase.auth.user',
      'supabase.auth.expires_at',
      'supabase.auth.provider_token',
      'supabase.auth.provider_refresh_token'
    ]
    
    defaultKeys.forEach(key => {
      if (!this.store.has(key)) {
        this.store.set(key, '')
      }
    })
    this.initialized = true
  }

  getItem(key: string) {
    if (!this.initialized) {
      this.initializeDefaults()
    }
    return this.store.get(key) || null
  }

  setItem(key: string, value: string) {
    if (!this.initialized) {
      this.initializeDefaults()
    }
    this.store.set(key, value)
  }

  removeItem(key: string) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
    this.initializeDefaults()
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
  
  // Initialize browser storage with defaults
  const initializeBrowserStorage = (storage: Storage | MemoryStorage) => {
    const defaultKeys = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'supabase.auth.user',
      'supabase.auth.expires_at',
      'supabase.auth.provider_token',
      'supabase.auth.provider_refresh_token'
    ]
    
    defaultKeys.forEach(key => {
      try {
        if (!storage.getItem(key)) {
          storage.setItem(key, '')
        }
      } catch (e) {
        console.warn(`Failed to initialize key ${key}:`, e)
      }
    })
  }
  
  let primaryStorage: Storage | MemoryStorage = memoryStore
  if (isBrowser) {
    try {
      // Test and initialize localStorage
      window.localStorage.setItem('supabase.test', 'test')
      window.localStorage.removeItem('supabase.test')
      initializeBrowserStorage(window.localStorage)
      primaryStorage = window.localStorage
    } catch (e) {
      console.warn('localStorage not available:', e)
      try {
        // Fallback to sessionStorage
        window.sessionStorage.setItem('supabase.test', 'test')
        window.sessionStorage.removeItem('supabase.test')
        initializeBrowserStorage(window.sessionStorage)
        primaryStorage = window.sessionStorage
      } catch (e) {
        console.warn('sessionStorage not available, using memory storage:', e)
      }
    }
  }

  return {
    getItem: (key: string): string | null => {
      try {
        // Always check memory first for faster access
        const memoryValue = memoryStore.getItem(key)
        if (memoryValue !== null) {
          return memoryValue
        }
        
        if (primaryStorage !== memoryStore) {
          const value = primaryStorage.getItem(key)
          if (value !== null) {
            memoryStore.setItem(key, value)
            return value
          }
        }
        
        // Initialize with empty string if not found
        memoryStore.setItem(key, '')
        if (primaryStorage !== memoryStore) {
          primaryStorage.setItem(key, '')
        }
        return ''
      } catch {
        // Ensure we always return a value
        const fallback = memoryStore.getItem(key) || ''
        return fallback
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        // Always set in memory first
        memoryStore.setItem(key, value)
        if (primaryStorage !== memoryStore) {
          primaryStorage.setItem(key, value)
        }
      } catch (e) {
        console.warn('Error setting storage item:', e)
      }
    },
    removeItem: (key: string): void => {
      try {
        // Set empty string instead of removing to prevent "not initialized" errors
        memoryStore.setItem(key, '')
        if (primaryStorage !== memoryStore) {
          primaryStorage.setItem(key, '')
        }
      } catch (e) {
        console.warn('Error removing storage item:', e)
      }
    },
    length: 0,
    key: (_index: number) => null,
    clear: () => {
      try {
        // Reinitialize with empty values instead of clearing
        memoryStore.clear()
        if (primaryStorage !== memoryStore) {
          const keys = Object.keys(primaryStorage)
          keys.forEach(key => {
            if (key.startsWith('supabase.auth.')) {
              primaryStorage.setItem(key, '')
            }
          })
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
  // Pre-initialize all auth-related storage keys
  const initializeAuthStorage = () => {
    const keys = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'supabase.auth.user',
      'supabase.auth.expires_at',
      'supabase.auth.provider_token',
      'supabase.auth.provider_refresh_token'
    ]
    
    keys.forEach(key => {
      if (!hybridStorage.getItem(key)) {
        hybridStorage.setItem(key, '')
      }
    })
  }

  // Run initialization immediately
  initializeAuthStorage()
} 