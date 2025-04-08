'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { ArrowCounterClockwise, ArrowClockwise, Play, Pause, CaretLeft } from '@phosphor-icons/react'

interface AudioData {
  title: string
  category: string
  duration: number
  url: string | null
}

export default function PlayPage() {
  const router = useRouter()
  const params = useParams()
  const [audioData, setAudioData] = useState<AudioData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [waveformData, setWaveformData] = useState<number[]>([])

  useEffect(() => {
    // TODO: Fetch audio data from Supabase based on params.type and params.id
    // For now, using mock data
    setAudioData({
      title: 'Short Session',
      category: 'Emotional Control Training',
      duration: 431, // 7:11 in seconds
      url: null // Will come from Supabase
    })
  }, [params])

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

  return (
    <div className="min-h-screen flex flex-col">
      {audioData?.url && (
        <audio
          ref={audioRef}
          src={audioData.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="p-4 text-white"
        aria-label="Go back"
      >
        <CaretLeft size={24} weight="light" />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-4 pb-12">
        {/* Session Image */}
        <div className="w-[280px] h-[280px] rounded-lg bg-[#2B6D79] overflow-hidden mb-8">
          <div className="w-full h-full relative">
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-white" style={{
              clipPath: 'polygon(0 65%, 100% 30%, 100% 100%, 0% 100%)'
            }}></div>
          </div>
        </div>

        {/* Session Info */}
        <h1 className="text-2xl font-medium mb-1">{audioData?.title}</h1>
        <p className="text-gray-400 mb-12">{audioData?.category}</p>

        {/* Waveform */}
        <div className="w-full mb-2">
          <div className="w-full h-12 flex items-center">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className={`w-1 mx-0.5 ${
                  i < (currentTime / (audioData?.duration || 1)) * 40 
                    ? 'bg-white' 
                    : 'bg-gray-600'
                }`}
                style={{
                  height: `${Math.random() * 100}%`,
                  minHeight: '15%'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Time Markers */}
        <div className="w-full flex justify-between text-gray-400 text-sm mb-12">
          <span>{formatTime(currentTime)}</span>
          <span>{audioData ? formatTime(audioData.duration) : '--:--'}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-12">
          {/* Rewind 15s */}
          <div className="flex flex-col items-center">
            <button 
              onClick={skipBackward}
              className="p-2 text-gray-400 hover:text-white transition-colors" 
              aria-label="Rewind 15 seconds"
            >
              <ArrowCounterClockwise size={32} weight="light" />
            </button>
            <span className="text-xs font-medium text-gray-400 mt-1">15</span>
          </div>

          {/* Play/Pause */}
          <button 
            onClick={togglePlayPause}
            className="w-16 h-16 flex items-center justify-center bg-[#2B6D79] rounded-full hover:bg-[#2B6D79]/90 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            disabled={!audioData?.url}
          >
            {isPlaying ? (
              <Pause size={24} weight="light" color="white" />
            ) : (
              <Play size={24} weight="light" color="white" />
            )}
          </button>

          {/* Forward 15s */}
          <div className="flex flex-col items-center">
            <button 
              onClick={skipForward}
              className="p-2 text-gray-400 hover:text-white transition-colors" 
              aria-label="Forward 15 seconds"
            >
              <ArrowClockwise size={32} weight="light" />
            </button>
            <span className="text-xs font-medium text-gray-400 mt-1">15</span>
          </div>
        </div>
      </div>
    </div>
  )
} 