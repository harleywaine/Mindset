export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tracks: {
        Row: {
          id: number
          title: string
          description: string
          duration: number
          type: 'switch' | 'switch-off' | 'foundation' | 'emotional_control' | 'visualization' | 'maintenance' | 'training' | 'take-control'
          audio_url: string
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          duration: number
          type: 'switch' | 'switch-off' | 'foundation' | 'emotional_control' | 'visualization' | 'maintenance' | 'training' | 'take-control'
          audio_url: string
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          duration?: number
          type?: 'switch' | 'switch-off' | 'foundation' | 'emotional_control' | 'visualization' | 'maintenance' | 'training' | 'take-control'
          audio_url?: string
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: number
          user_id: string
          track_id: number
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          track_id: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          track_id?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_track_completion: {
        Args: {
          p_user_id: string
          p_track_id: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 