import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a robust storage wrapper with initialization checks
const createStorage = () => {
  let storage: Storage | null = null
  
  // Initialize storage safely
  if (typeof window !== 'undefined') {
    try {
      // Test if localStorage is actually available
      localStorage.setItem('supabase.test-ls', 'test')
      localStorage.removeItem('supabase.test-ls')
      storage = window.localStorage
    } catch {
      console.warn('localStorage not available, falling back to in-memory storage')
      // Fallback to in-memory storage
      const memoryStorage: { [key: string]: string } = {}
      storage = {
        getItem: (key: string) => memoryStorage[key] || null,
        setItem: (key: string, value: string) => { memoryStorage[key] = value },
        removeItem: (key: string) => { delete memoryStorage[key] },
        clear: () => { Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]) },
        key: (index: number) => Object.keys(memoryStorage)[index] || null,
        length: 0
      }
    }
  }

  return {
    getItem: (key: string): string => {
      try {
        const item = storage?.getItem(key)
        return item || ''
      } catch (error) {
        console.warn('Error reading from storage:', error)
        return ''
      }
    },
    setItem: (key: string, value: string) => {
      try {
        storage?.setItem(key, value)
      } catch (error) {
        console.warn('Error writing to storage:', error)
      }
    },
    removeItem: (key: string) => {
      try {
        storage?.removeItem(key)
      } catch (error) {
        console.warn('Error removing from storage:', error)
      }
    },
    clear: () => {
      try {
        storage?.clear()
      } catch (error) {
        console.warn('Error clearing storage:', error)
      }
    }
  }
}

// Initialize Supabase with enhanced config
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorage(),
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    debug: true // Enable debug mode temporarily to track auth issues
  }
}) 