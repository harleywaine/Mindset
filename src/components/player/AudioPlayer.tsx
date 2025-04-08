import { useState, useRef, useEffect } from 'react'
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { trackService } from '@/lib/services/trackService'

interface AudioPlayerProps {
  trackId: number
  title: string
  duration: number
  fileUrl: string
  onComplete?: () => void
  initialCompleted?: boolean
}

export default function AudioPlayer({ 
  trackId, 
  title, 
  duration, 
  fileUrl, 
  onComplete,
  initialCompleted = false
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { user } = useAuth()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      const progress = (audio.currentTime / audio.duration) * 100
      setProgress(progress)
    }

    const handleEnded = async () => {
      setIsPlaying(false)
      setProgress(0)
      
      if (user && !isCompleted) {
        try {
          await trackService.markTrackCompleted(user.id, trackId)
          setIsCompleted(true)
        } catch (error) {
          console.error('Error marking track as completed:', error)
        }
      }
      
      onComplete?.()
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [user, trackId, isCompleted, onComplete])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          ) : (
            <div className="h-5 w-5 rounded-full border border-gray-500" />
          )}
          <h3 className="text-white font-medium">{title}</h3>
        </div>
        <button
          onClick={togglePlay}
          className="text-indigo-400 hover:text-indigo-300 focus:outline-none"
        >
          {isPlaying ? (
            <PauseIcon className="h-8 w-8" />
          ) : (
            <PlayIcon className="h-8 w-8" />
          )}
        </button>
      </div>
      <div className="relative h-1 bg-gray-700 rounded-full">
        <div
          className="absolute h-full bg-indigo-400 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{formatTime((progress / 100) * duration)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <audio ref={audioRef} src={fileUrl} />
    </div>
  )
} 