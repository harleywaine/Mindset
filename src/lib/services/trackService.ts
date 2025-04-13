import { createClient } from '@/lib/supabase/client'

export interface Track {
  id: number
  title: string
  description: string
  duration: number
  type: 'switch' | 'switch-off' | 'foundation' | 'emotional_control' | 'visualization' | 'maintenance' | 'training' | 'take-control'
  audio_url: string
  created_at: string
}

export interface UserProgress {
  id: number
  user_id: string
  track_id: number
  completed: boolean
  completed_at: string | null
  created_at: string
}

const isValidTrackType = (type: string): type is Track['type'] => {
  return ['switch', 'switch-off', 'foundation', 'emotional_control', 'visualization', 'maintenance', 'training', 'take-control'].includes(type)
}

export const trackService = {
  isValidTrackType,
  // Get all tracks by type
  async getTracksByType(type: Track['type']) {
    console.log('Getting tracks by type:', type)
    
    if (!isValidTrackType(type)) {
      console.error('Invalid track type:', type)
      throw new Error('Invalid track type')
    }

    const supabase = createClient()
    try {
      console.log('Fetching from Supabase...')
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('type', type)
        .order('id', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Fetched tracks:', data)
      return data as Track[]
    } catch (error) {
      console.error('Error fetching tracks:', error)
      throw error
    }
  },

  // Get a single track by type and ID
  async getTrackById(type: string, id: string | number) {
    if (!isValidTrackType(type)) {
      throw new Error('Invalid track type')
    }

    // If id is a string that represents a valid number, convert it
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id

    if (isNaN(numericId)) {
      throw new Error('Invalid track ID')
    }

    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('type', type)
        .eq('id', numericId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Track not found
        }
        throw error
      }
      return data as Track
    } catch (error) {
      console.error('Error fetching track:', error)
      throw error
    }
  },

  // Get user progress for a track
  async getUserProgress(userId: string, trackId: string | number) {
    // If trackId is a string that represents a valid number, convert it
    const numericId = typeof trackId === 'string' ? parseInt(trackId, 10) : trackId

    if (isNaN(numericId)) {
      throw new Error('Invalid track ID')
    }

    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('track_id', numericId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data as UserProgress | null
    } catch (error) {
      console.error('Error fetching user progress:', error)
      throw error
    }
  },

  // Get all user progress
  async getAllUserProgress(userId: string) {
    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      return data as UserProgress[]
    } catch (error) {
      console.error('Error fetching all user progress:', error)
      throw error
    }
  },

  // Mark track as completed
  async markTrackCompleted(userId: string, trackId: string | number) {
    // If trackId is a string that represents a valid number, convert it
    const numericId = typeof trackId === 'string' ? parseInt(trackId, 10) : trackId

    if (isNaN(numericId)) {
      throw new Error('Invalid track ID')
    }

    const supabase = createClient()
    try {
      const { error } = await supabase.rpc('update_track_completion', {
        p_user_id: userId,
        p_track_id: numericId
      })

      if (error) throw error
    } catch (error) {
      console.error('Error marking track as completed:', error)
      throw error
    }
  },

  // Get track with user progress
  async getTrackWithProgress(userId: string, trackId: string | number) {
    // If trackId is a string that represents a valid number, convert it
    const numericId = typeof trackId === 'string' ? parseInt(trackId, 10) : trackId

    if (isNaN(numericId)) {
      throw new Error('Invalid track ID')
    }

    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select(`
          *,
          user_progress!left (
            completed,
            completed_at
          )
        `)
        .eq('id', numericId)
        .eq('user_progress.user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Track not found
        }
        throw error
      }

      // Validate the track type after fetching
      if (data && !isValidTrackType(data.type)) {
        throw new Error('Invalid track type')
      }

      return data as Track
    } catch (error) {
      console.error('Error fetching track:', error)
      throw error
    }
  }
} 