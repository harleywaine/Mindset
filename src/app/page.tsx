'use client'

import { Lightning, BatteryFull, ShieldCheck } from '@phosphor-icons/react'
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

  const switches = [
    { name: 'Switch On', Icon: Lightning, href: '/switch-on' },
    { name: 'Switch Off', Icon: BatteryFull, href: '/switch-off' },
    { name: 'Take Control', Icon: ShieldCheck, href: '/take-control' },
  ]

  return (
    <main>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to Meditation App</h1>
        <p className="text-xl text-gray-400">Let's make some progress</p>
      </div>

      {/* Switches Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-8">Flick the switch</h2>
        <div className="flex justify-between max-w-xl">
          {switches.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center group"
            >
              <div className="w-20 h-20 relative mb-3">
                <svg
                  viewBox="0 0 64 64"
                  className="w-full h-full absolute"
                  style={{
                    filter: 'drop-shadow(0px 2.8px 9.8px rgba(0, 0, 0, 0.25))'
                  }}
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="30"
                    fill="#2B6D79"
                    stroke="#313336"
                    strokeWidth="4"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <item.Icon size={36} weight="light" className="text-white" />
                </div>
              </div>
              <span className="text-lg text-white group-hover:text-[#2B6D79] transition-colors">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Foundations Section */}
      <section className="mb-24">
        <h2 className="text-2xl font-semibold text-white mb-8">Foundations</h2>
        <div className="space-y-4 max-w-2xl">
          {foundations.map((item) => (
            <LessonCard
              key={item.id}
              title={item.title}
              duration={item.duration}
              type={item.type}
              id={item.id}
              completed={item.completed}
            />
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
