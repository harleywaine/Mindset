import { supabase } from '../supabase/client'

export interface Track {
  id: number
  title: string
  duration: number
  section: string
  group_name: string
  file_url: string
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

export const trackService = {
  // Get all tracks
  async getTracks() {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as Track[]
  },

  // Get tracks by section
  async getTracksBySection(section: string) {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('section', section)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as Track[]
  },

  // Get user progress for a track
  async getUserProgress(userId: string, trackId: number) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('track_id', trackId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as UserProgress | null
  },

  // Get all user progress
  async getAllUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data as UserProgress[]
  },

  // Mark track as completed
  async markTrackCompleted(userId: string, trackId: number) {
    const { error } = await supabase.rpc('update_track_completion', {
      p_user_id: userId,
      p_track_id: trackId
    })

    if (error) throw error
  },

  // Get track with user progress
  async getTrackWithProgress(userId: string, trackId: number) {
    const { data, error } = await supabase
      .from('tracks')
      .select(`
        *,
        user_progress!inner (
          completed,
          completed_at
        )
      `)
      .eq('id', trackId)
      .eq('user_progress.user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as (Track & { user_progress: UserProgress }) | null
  }
} 