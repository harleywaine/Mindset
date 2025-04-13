'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { ArrowCounterClockwise, ArrowClockwise, Play, Pause, CaretLeft } from '@phosphor-icons/react'
import { trackService, Track } from '@/lib/services/trackService'
import { useAuth } from '@/contexts/AuthContext'

interface AudioData {
  title: string
  description: string
  duration: number
  url: string
}

// Static tracks as fallback
const staticTracks: Record<number, Track> = {
  8: {
    id: 8,
    title: 'Short Version',
    description: 'A calming 5-minute session to help you wind down',
    duration: 300,
    type: 'switch-off',
    audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
    created_at: new Date().toISOString()
  },
  9: {
    id: 9,
    title: 'Medium Version',
    description: 'A relaxing 10-minute session for optimal unwinding',
    duration: 600,
    type: 'switch-off',
    audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
    created_at: new Date().toISOString()
  },
  10: {
    id: 10,
    title: 'Long Version',
    description: 'A comprehensive 20-minute session for deep relaxation',
    duration: 1200,
    type: 'switch-off',
    audio_url: 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
    created_at: new Date().toISOString()
  }
}

export default function PlayPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [audioData, setAudioData] = useState<AudioData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const loadTrack = async () => {
      try {
        if (!user) {
          router.push('/login')
          return
        }

        const id = Number(params.id)
        if (isNaN(id)) {
          console.error('Invalid track ID:', params.id)
          router.push('/not-found')
          return
        }

        // Try to get the track from the database first
        let track = await trackService.getTrackWithProgress(user.id, id)
        
        // If not found in database, use static track
        if (!track && staticTracks[id]) {
          track = staticTracks[id]
        }

        if (!track) {
          console.error('Track not found:', id)
          router.push('/not-found')
          return
        }

        setAudioData({
          title: track.title,
          description: track.description,
          duration: track.duration,
          url: track.audio_url
        })
      } catch (error) {
        console.error('Error loading track:', error)
        setError('Failed to load track')
      }
    }

    loadTrack()
  }, [params.id, user, router])

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

  if (!audioData) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
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
          <h1 className="text-3xl font-bold mb-4">{audioData.title}</h1>
          <p className="text-gray-400 mb-8">{audioData.description}</p>
          
          <div className="bg-[#23262A] rounded-lg shadow-lg p-6">
            <audio 
              ref={audioRef}
              className="hidden"
              src={audioData.url}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleTrackEnd}
            >
              Your browser does not support the audio element.
            </audio>
            
            {/* Custom audio controls */}
            <div className="flex flex-col items-center gap-6">
              {/* Time display */}
              <div className="text-2xl font-medium text-gray-200">
                {formatTime(currentTime)} / {formatTime(audioData.duration)}
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
                  style={{ width: `${(currentTime / audioData.duration) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 