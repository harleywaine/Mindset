'use client'

import { CaretLeft } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TakeControl() {
  const router = useRouter()

  const sessions = [
    { title: 'Short Version', duration: '5 Minutes', type: 'switch', id: 'control-short' },
    { title: 'Medium Version', duration: '10 Minutes', type: 'switch', id: 'control-medium' },
    { title: 'Long Version', duration: '20 Minutes', type: 'switch', id: 'control-long' },
  ]

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-start">
        <button
          onClick={() => router.back()}
          className="p-4 -ml-4 text-white"
          aria-label="Go back"
        >
          <CaretLeft size={24} weight="light" />
        </button>
      </div>

      {/* Title and description */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Take Control</h1>
        <p className="text-gray-400">Regain focus and mental clarity with guided control sessions</p>
      </div>

      {/* Session list */}
      <div className="space-y-3">
        {sessions.map((session) => (
          <Link 
            key={session.id}
            href={`/play/${session.type}/${session.id}`}
            className="flex items-center gap-3 p-4 rounded-lg bg-[#23262A] hover:bg-[#2B6D79]/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-[#1A1D20] flex items-center justify-center text-[#2B6D79]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5.14L19 12L8 18.86V5.14Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{session.title}</h3>
              <p className="text-sm text-gray-400">{session.duration}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 