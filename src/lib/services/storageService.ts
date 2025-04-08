import { supabase } from '../supabase/client'

export const storageService = {
  // Get public URL for an audio file
  getAudioUrl(path: string) {
    const { data } = supabase.storage
      .from('audio')
      .getPublicUrl(path)
    return data.publicUrl
  },

  // Upload an audio file
  async uploadAudio(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('audio')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) throw error
    return data
  },

  // Delete an audio file
  async deleteAudio(path: string) {
    const { error } = await supabase.storage
      .from('audio')
      .remove([path])

    if (error) throw error
  },

  // List audio files in a directory
  async listAudioFiles(prefix: string = '') {
    const { data, error } = await supabase.storage
      .from('audio')
      .list(prefix)

    if (error) throw error
    return data
  }
} 