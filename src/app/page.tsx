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
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Welcome to Meditation App</h1>
        <p className="text-gray-400">Let's make some progress</p>
      </div>

      {/* Switches Section */}
      <section className="mb-8">
        <h2 className="text-lg mb-4">Flick the switch</h2>
        <div className="flex justify-between px-4">
          {switches.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 relative mb-2">
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
                  <item.Icon size={32} weight="light" className="text-white" />
                </div>
              </div>
              <span className="text-sm text-center whitespace-nowrap">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Foundations Section */}
      <section>
        <h2 className="text-lg mb-4">Foundations</h2>
        <div className="space-y-3">
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
    </>
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
