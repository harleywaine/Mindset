'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { ArrowCounterClockwise, ArrowClockwise, Play, Pause, CaretLeft } from '@phosphor-icons/react'
import { trackService, Track } from '@/lib/services/trackService'
import { useAuth } from '@/contexts/AuthContext'
import { redirect } from 'next/navigation'

interface AudioData {
  title: string
  description: string
  duration: number
  url: string
}

// Static tracks as fallback, organized by type
const staticTracks: Record<Track['type'], Record<number, Track>> = {
  'switch': {
    5: {
      id: 5,
      title: 'Basic Switch Training',
      description: 'Learn the fundamentals of switching your attention',
      duration: 300,
      type: 'switch',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    6: {
      id: 6,
      title: 'Advanced Switch Training',
      description: 'Master advanced switching techniques',
      duration: 420,
      type: 'switch',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    7: {
      id: 7,
      title: 'Expert Switch Training',
      description: 'Expert-level switching exercises',
      duration: 600,
      type: 'switch',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    }
  },
  'foundation': {
    1: {
      id: 1,
      title: 'Foundation Basics',
      description: 'Build your meditation foundation with essential techniques',
      duration: 300,
      type: 'foundation',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    2: {
      id: 2,
      title: 'Breathing Techniques',
      description: 'Learn powerful breathing exercises for better focus and relaxation',
      duration: 300,
      type: 'foundation',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    3: {
      id: 3,
      title: 'Body Awareness',
      description: 'Develop a deeper connection with your body through mindful awareness',
      duration: 300,
      type: 'foundation',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    4: {
      id: 4,
      title: 'Mental Focus',
      description: 'Master techniques to improve concentration and mental clarity',
      duration: 300,
      type: 'foundation',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    }
  },
  'maintenance': {
    1: {
      id: 1,
      title: 'Quick Reset',
      description: 'A quick 2-minute session to reset your emotional state',
      duration: 120,
      type: 'maintenance',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    2: {
      id: 2,
      title: 'Emotional Balance',
      description: 'A 5-minute session to restore emotional balance',
      duration: 300,
      type: 'maintenance',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    3: {
      id: 3,
      title: 'Stress Relief',
      description: 'A comprehensive 10-minute session for deep stress relief',
      duration: 600,
      type: 'maintenance',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    }
  },
  'training': {
    1: {
      id: 1,
      title: 'Understanding Emotions',
      description: 'Learn the fundamentals of emotional awareness and control',
      duration: 600,
      type: 'training',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    2: {
      id: 2,
      title: 'Emotional Awareness',
      description: 'Develop deeper awareness of your emotional patterns',
      duration: 900,
      type: 'training',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    3: {
      id: 3,
      title: 'Response Control',
      description: 'Master techniques for controlling emotional responses',
      duration: 900,
      type: 'training',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    4: {
      id: 4,
      title: 'Advanced Regulation',
      description: 'Advanced techniques for emotional regulation in challenging situations',
      duration: 1200,
      type: 'training',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    }
  },
  'visualization': {
    1: {
      id: 1,
      title: 'Basic Visualization',
      description: 'Learn the fundamentals of performance visualization',
      duration: 600,
      type: 'visualization',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    2: {
      id: 2,
      title: 'Advanced Visualization',
      description: 'Master advanced visualization techniques',
      duration: 900,
      type: 'visualization',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    },
    3: {
      id: 3,
      title: 'Expert Visualization',
      description: 'Expert-level visualization training',
      duration: 1200,
      type: 'visualization',
      audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
      created_at: new Date().toISOString()
    }
  },
  'switch-off': {},
  'emotional_control': {},
  'take-control': {}
}

export default function PlayPage({ params }: { params: { type: string; id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [track, setTrack] = useState<Track | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const loadTrack = async () => {
      try {
        // Validate track type
        if (!trackService.isValidTrackType(params.type)) {
          console.error('Invalid track type:', params.type)
          setError(`Invalid track type: ${params.type}`)
          return
        }

        const trackId = Number(params.id)
        if (isNaN(trackId)) {
          console.error('Invalid track ID:', params.id)
          setError(`Invalid track ID: ${params.id}`)
          return
        }

        // Try to load from database first
        let loadedTrack = user ? 
          await trackService.getTrackWithProgress(user.id, trackId) :
          await trackService.getTrackById(params.type, trackId)

        // If not found in database, try static tracks
        if (!loadedTrack) {
          loadedTrack = staticTracks[params.type as Track['type']]?.[trackId] || null
        }

        if (!loadedTrack) {
          console.error('Track not found:', params.type, trackId)
          setError(`Track not found: ${params.type} ${trackId}`)
          return
        }

        setTrack(loadedTrack)
        setError(null)
      } catch (err) {
        console.error('Error loading track:', err)
        setError('Failed to load track')
      }
    }

    loadTrack()
  }, [params.type, params.id, user])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleTrackEnd = async () => {
    setIsPlaying(false)
    if (user) {
      try {
        await trackService.markTrackCompleted(user.id, params.id as string)
      } catch (error) {
        console.error('Error marking track as completed:', error)
      }
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 15)
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-300">{error}</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    )
  }

  if (!track) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <CaretLeft size={20} />
          <span>Back</span>
        </button>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">{track.title}</h1>
          <p className="text-gray-400 mb-8">{track.description}</p>
          
          <div className="bg-[#23262A] rounded-lg shadow-lg p-6">
            <audio 
              ref={audioRef}
              className="hidden"
              src={track.audio_url}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleTrackEnd}
            >
              Your browser does not support the audio element.
            </audio>
            
            {/* Custom audio controls */}
            <div className="flex flex-col items-center gap-6">
              {/* Time display */}
              <div className="text-2xl font-medium text-gray-200">
                {formatTime(currentTime)} / {formatTime(track.duration)}
              </div>

              {/* Control buttons */}
              <div className="flex items-center gap-8">
                <button
                  onClick={skipBackward}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Skip backward 15 seconds"
                >
                  <ArrowCounterClockwise size={32} />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="w-16 h-16 rounded-full bg-[#2B6D79] hover:bg-[#2B6D79]/90 flex items-center justify-center text-white transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} weight="fill" />}
                </button>

                <button
                  onClick={skipForward}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Skip forward 15 seconds"
                >
                  <ArrowClockwise size={32} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                <div 
                  className="bg-[#2B6D79] h-full transition-all duration-300"
                  style={{ width: `${(currentTime / track.duration) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 