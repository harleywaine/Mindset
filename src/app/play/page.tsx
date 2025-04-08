'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function PlayPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="p-4 text-white"
        aria-label="Go back"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
        <h1 className="text-2xl font-medium mb-1">Short Session</h1>
        <p className="text-gray-400 mb-12">Emotional Control Training</p>

        {/* Waveform */}
        <div className="w-full mb-2">
          <div className="w-full h-12 flex items-center">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className={`w-1 mx-0.5 bg-gray-400 ${
                  i < 15 ? 'bg-white' : 'bg-gray-600'
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
          <span>3:43</span>
          <span>7:11</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8">
          {/* Rewind */}
          <button className="p-3 text-gray-400 hover:text-white transition-colors" aria-label="Rewind">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 9L9 12L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <button 
            className="w-16 h-16 flex items-center justify-center bg-[#2B6D79] rounded-full hover:bg-[#2B6D79]/90 transition-colors"
            aria-label="Pause"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="7" y="6" width="3" height="12" fill="white"/>
              <rect x="14" y="6" width="3" height="12" fill="white"/>
            </svg>
          </button>

          {/* Forward */}
          <button className="p-3 text-gray-400 hover:text-white transition-colors" aria-label="Forward">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 15L15 12L12 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
} 