'use client'

import { Lightning, BatteryFull, ShieldCheck, Zap, Battery, Shield } from '@phosphor-icons/react'
import Link from 'next/link'
import LessonCard from '@/components/cards/LessonCard'

interface Lesson {
  id: number
  title: string
  duration: string
  type: string
  completed: boolean
}

export default function Home() {
  const foundations: Lesson[] = [
    { 
      id: 1, 
      title: 'Foundation Basics', 
      duration: '5 Minutes', 
      type: 'foundation', 
      completed: false 
    },
    { 
      id: 2, 
      title: 'Breathing Techniques', 
      duration: '5 Minutes', 
      type: 'foundation', 
      completed: false 
    },
    { 
      id: 3, 
      title: 'Body Awareness', 
      duration: '5 Minutes', 
      type: 'foundation', 
      completed: false 
    },
    { 
      id: 4, 
      title: 'Mental Focus', 
      duration: '5 Minutes', 
      type: 'foundation', 
      completed: false 
    }
  ]

  return (
    <main className="flex flex-col gap-8 p-4 pb-24">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">Welcome to<br />Meditation App</h1>
        <p className="text-gray-400">Let's make some progress</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Flick the switch</h2>
        <div className="grid grid-cols-3 gap-4">
          <Link href="/switch/on" className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#2B6D79] flex items-center justify-center">
              <Zap size={32} className="text-white" />
            </div>
            <span className="text-white text-sm">Switch On</span>
          </Link>
          <Link href="/switch/off" className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#2B6D79] flex items-center justify-center">
              <Battery size={32} className="text-white" />
            </div>
            <span className="text-white text-sm">Switch Off</span>
          </Link>
          <Link href="/switch/control" className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#2B6D79] flex items-center justify-center">
              <Shield size={32} className="text-white" />
            </div>
            <span className="text-white text-sm">Take Control</span>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Foundations</h2>
        <div className="space-y-3">
          {foundations.map((track) => (
            <LessonCard key={track.id} {...track} />
          ))}
        </div>
      </section>
    </main>
  )
}

function PlayIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function ChevronRightIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
