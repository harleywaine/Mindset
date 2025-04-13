'use client'

import { CaretLeft } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { trackService, Track } from '@/lib/services/trackService'

export default function SwitchOn() {
  const router = useRouter()
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Static tracks as fallback
  const staticTracks = [
    { 
      id: 5, 
      title: 'Short Version', 
      duration: 300, 
      type: 'switch', 
      description: 'Quick focus session',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    { 
      id: 6, 
      title: 'Medium Version', 
      duration: 600, 
      type: 'switch', 
      description: 'Standard focus session',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    { 
      id: 7, 
      title: 'Long Version', 
      duration: 1200, 
      type: 'switch', 
      description: 'Deep focus session',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    }
  ] as Track[]

  useEffect(() => {
    const loadTracks = async () => {
      try {
        console.log('Fetching switch tracks...')
        const allTracks = await trackService.getTracksByType('switch')
        console.log('All switch tracks:', allTracks)
        
        // Filter only Switch On tracks (IDs 5, 6, 7)
        const switchOnTracks = allTracks.filter(track => [5, 6, 7].includes(track.id))
        console.log('Filtered Switch On tracks:', switchOnTracks)
        
        setTracks(switchOnTracks.length > 0 ? switchOnTracks : staticTracks)
      } catch (error) {
        console.error('Error loading tracks:', error)
        setTracks(staticTracks) // Use static tracks as fallback
        setError(error instanceof Error ? error.message : 'Failed to load tracks')
      } finally {
        setLoading(false)
      }
    }

    loadTracks()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-start">
            <button
              onClick={() => router.back()}
              className="p-4 -ml-4 text-white hover:text-gray-300 transition-colors"
              aria-label="Go back"
            >
              <CaretLeft size={24} weight="light" />
            </button>
          </div>

          {/* Title and description */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Switch On</h1>
            <p className="text-gray-400">Prime yourself for peak focus and mental performance with guided sessions</p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Session list */}
          {!loading && !error && (
            <div className="space-y-3">
              {(tracks.length > 0 ? tracks : staticTracks).map((track) => (
                <Link 
                  key={track.id}
                  href={`/play/switch/${track.id}`}
                  className="flex items-center gap-3 p-4 rounded-lg bg-[#23262A] hover:bg-[#2B6D79]/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1A1D20] flex items-center justify-center text-[#2B6D79]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5.14L19 12L8 18.86V5.14Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-sm text-gray-400">{Math.floor(track.duration / 60)} Minutes</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 