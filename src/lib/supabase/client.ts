import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Default keys that need to be initialized
const AUTH_STORAGE_KEYS = [
  'supabase.auth.token',
  'supabase.auth.refreshToken',
  'supabase.auth.user',
  'supabase.auth.expires_at',
  'supabase.auth.provider_token',
  'supabase.auth.provider_refresh_token'
]

// Global cache to prevent initialization checks
const initializedKeys = new Set<string>()

// Memory storage implementation
class MemoryStorage {
  private store: Map<string, string>
  
  constructor() {
    this.store = new Map()
    this.initializeDefaults()
  }

  private initializeDefaults() {
    AUTH_STORAGE_KEYS.forEach(key => {
      if (!this.store.has(key)) {
        this.store.set(key, '')
        initializedKeys.add(key)
      }
    })
  }

  getItem(key: string) {
    // Always ensure the key is initialized
    if (!this.store.has(key)) {
      this.store.set(key, '')
      initializedKeys.add(key)
    }
    return this.store.get(key) || ''
  }

  setItem(key: string, value: string) {
    this.store.set(key, value)
    initializedKeys.add(key)
  }

  removeItem(key: string) {
    // Don't actually remove, just set to empty
    this.store.set(key, '')
  }

  clear() {
    // Don't actually clear, reinitialize all keys
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
  
  // Initialize storage with empty values
  const initializeStorage = (storage: Storage | MemoryStorage) => {
    AUTH_STORAGE_KEYS.forEach(key => {
      try {
        const existing = storage.getItem(key)
        if (!existing) {
          storage.setItem(key, '')
        }
        initializedKeys.add(key)
      } catch (e) {
        console.warn(`Storage initialization warning for ${key}:`, e)
      }
    })
  }

  let primaryStorage: Storage | MemoryStorage = memoryStore
  
  // Only try browser storage in client context
  if (typeof window !== 'undefined') {
    try {
      initializeStorage(window.localStorage)
      primaryStorage = window.localStorage
    } catch (e) {
      try {
        initializeStorage(window.sessionStorage)
        primaryStorage = window.sessionStorage
      } catch (e) {
        console.warn('Browser storage not available, using memory storage')
      }
    }
  }

  return {
    getItem: (key: string): string => {
      try {
        // Ensure key is initialized
        if (!initializedKeys.has(key)) {
          memoryStore.setItem(key, '')
          if (primaryStorage !== memoryStore) {
            try {
              primaryStorage.setItem(key, '')
            } catch (e) {
              // Ignore storage errors
            }
          }
          initializedKeys.add(key)
        }

        // Try memory first
        const memValue = memoryStore.getItem(key)
        if (memValue) return memValue

        // Try primary storage
        if (primaryStorage !== memoryStore) {
          try {
            const value = primaryStorage.getItem(key)
            if (value) {
              memoryStore.setItem(key, value)
              return value
            }
          } catch (e) {
            // Ignore storage errors
          }
        }

        return ''
      } catch (e) {
        return ''
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        memoryStore.setItem(key, value)
        initializedKeys.add(key)
        
        if (primaryStorage !== memoryStore) {
          try {
            primaryStorage.setItem(key, value)
          } catch (e) {
            // Ignore storage errors
          }
        }
      } catch (e) {
        // Ensure the key is at least initialized
        memoryStore.setItem(key, '')
        initializedKeys.add(key)
      }
    },
    removeItem: (key: string): void => {
      try {
        // Don't remove, set to empty string
        memoryStore.setItem(key, '')
        if (primaryStorage !== memoryStore) {
          try {
            primaryStorage.setItem(key, '')
          } catch (e) {
            // Ignore storage errors
          }
        }
      } catch (e) {
        // Ensure the key is at least initialized
        memoryStore.setItem(key, '')
      }
    },
    length: 0,
    key: () => null,
    clear: () => {
      // Don't actually clear, just reinitialize
      AUTH_STORAGE_KEYS.forEach(key => {
        try {
          memoryStore.setItem(key, '')
          if (primaryStorage !== memoryStore) {
            try {
              primaryStorage.setItem(key, '')
            } catch (e) {
              // Ignore storage errors
            }
          }
          initializedKeys.add(key)
        } catch (e) {
          // Ignore errors
        }
      })
    }
  }
}

// Create storage instance
const hybridStorage = createHybridStorage()

// Initialize Supabase with minimal config
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