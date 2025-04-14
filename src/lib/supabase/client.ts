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
  private defaultLocation: string | null = null
  
  constructor() {
    this.store = new Map()
    this.initializeDefaults()
  }

  private initializeDefaults() {
    // Initialize auth keys
    AUTH_STORAGE_KEYS.forEach(key => {
      if (!this.store.has(key)) {
        this.store.set(key, '')
      }
    })

    // Set default saving location
    if (!this.defaultLocation) {
      try {
        if (typeof window !== 'undefined') {
          this.defaultLocation = window.location.origin
        }
      } catch (e) {
        this.defaultLocation = 'default'
      }
      this.store.set('defaultSavingLocation', this.defaultLocation || 'default')
    }
  }

  getItem(key: string) {
    // Special handling for location-related keys
    if (key === 'defaultSavingLocation' || key.includes('location')) {
      return this.defaultLocation || 'default'
    }
    
    // Handle auth keys
    if (!this.store.has(key)) {
      this.store.set(key, '')
    }
    return this.store.get(key) || ''
  }

  setItem(key: string, value: string) {
    // Special handling for location-related keys
    if (key === 'defaultSavingLocation' || key.includes('location')) {
      this.defaultLocation = value
    }
    this.store.set(key, value)
  }

  removeItem(key: string) {
    // Don't actually remove, just set to empty or default
    if (key === 'defaultSavingLocation' || key.includes('location')) {
      this.store.set(key, this.defaultLocation || 'default')
    } else {
      this.store.set(key, '')
    }
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
  
  // Initialize storage with empty values and location
  const initializeStorage = (storage: Storage | MemoryStorage) => {
    // Initialize auth keys
    AUTH_STORAGE_KEYS.forEach(key => {
      try {
        const existing = storage.getItem(key)
        if (!existing) {
          storage.setItem(key, '')
        }
      } catch (e) {
        // Ignore initialization errors
      }
    })

    // Initialize location
    try {
      if (typeof window !== 'undefined') {
        const location = window.location.origin
        storage.setItem('defaultSavingLocation', location)
      }
    } catch (e) {
      storage.setItem('defaultSavingLocation', 'default')
    }
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
        // Fallback to memory storage
        console.warn('Browser storage not available, using memory storage')
      }
    }
  }

  return {
    getItem: (key: string): string => {
      try {
        // Special handling for location-related keys
        if (key === 'defaultSavingLocation' || key.includes('location')) {
          const locationValue = primaryStorage.getItem(key)
          if (locationValue) return locationValue
          
          // Set and return default location
          const defaultLocation = typeof window !== 'undefined' ? window.location.origin : 'default'
          primaryStorage.setItem(key, defaultLocation)
          return defaultLocation
        }

        // Handle other keys
        const value = primaryStorage.getItem(key)
        if (value) return value

        // Initialize if not found
        primaryStorage.setItem(key, '')
        return ''
      } catch (e) {
        return memoryStore.getItem(key)
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        primaryStorage.setItem(key, value)
      } catch (e) {
        memoryStore.setItem(key, value)
      }
    },
    removeItem: (key: string): void => {
      try {
        // Don't remove location keys, reset to default
        if (key === 'defaultSavingLocation' || key.includes('location')) {
          const defaultLocation = typeof window !== 'undefined' ? window.location.origin : 'default'
          primaryStorage.setItem(key, defaultLocation)
        } else {
          primaryStorage.setItem(key, '')
        }
      } catch (e) {
        memoryStore.removeItem(key)
      }
    },
    length: 0,
    key: () => null,
    clear: () => {
      try {
        // Don't actually clear, reinitialize
        initializeStorage(primaryStorage)
      } catch (e) {
        memoryStore.clear()
      }
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