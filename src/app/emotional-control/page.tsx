'use client'

import { useAuth } from '@/contexts/AuthContext'
import LessonCard from '@/components/cards/LessonCard'
import Link from 'next/link'

interface Lesson {
  id: number
  title: string
  duration: string
  type: string
  completed: boolean
}

export default function EmotionalControlPage() {
  const maintenanceSessions: Lesson[] = [
    { 
      id: 1, 
      title: 'Quick Reset', 
      duration: '2 Minutes', 
      type: 'maintenance', 
      completed: false 
    },
    { 
      id: 2, 
      title: 'Emotional Balance', 
      duration: '5 Minutes', 
      type: 'maintenance', 
      completed: false 
    },
    { 
      id: 3, 
      title: 'Stress Relief', 
      duration: '10 Minutes', 
      type: 'maintenance', 
      completed: false 
    }
  ]

  const trainingLessons: Lesson[] = [
    { 
      id: 1, 
      title: 'Understanding Emotions', 
      duration: '10 Minutes', 
      type: 'training', 
      completed: false 
    },
    { 
      id: 2, 
      title: 'Emotional Awareness', 
      duration: '15 Minutes', 
      type: 'training', 
      completed: false 
    },
    { 
      id: 3, 
      title: 'Response Control', 
      duration: '15 Minutes', 
      type: 'training', 
      completed: false 
    },
    { 
      id: 4, 
      title: 'Advanced Regulation', 
      duration: '20 Minutes', 
      type: 'training', 
      completed: false 
    }
  ]

  return (
    <>
      {/* Background Image */}
      <div 
        className="absolute top-0 left-0 right-0 w-full h-screen pointer-events-none"
        style={{
          backgroundImage: 'url(/grid-bg.png)',
          backgroundSize: '100% auto',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          opacity: 0.5,
          zIndex: -1
        }}
      />

      {/* Content */}
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Emotional Control Training</h1>
          <p className="text-gray-400">Master your emotional state</p>
        </div>

        {/* Maintenance Sessions */}
        <section>
          <h2 className="text-lg mb-4">Maintenance</h2>
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-3 w-max">
              {maintenanceSessions.map((session) => (
                <Link 
                  key={session.id}
                  href={`/play/${session.type}/${session.id}`}
                  className="flex flex-col p-3 rounded-lg bg-[#23262A] hover:bg-[#2B6D79]/10 transition-colors w-[160px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1A1D20] flex items-center justify-center text-[#2B6D79] mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5.14L19 12L8 18.86V5.14Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="font-medium text-sm">{session.title}</h3>
                  <p className="text-sm text-gray-400">{session.duration}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Training Lessons */}
        <section>
          <h2 className="text-lg mb-4">Training Lessons</h2>
          <div className="space-y-3">
            {trainingLessons.map((item) => (
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
      </div>
    </>
  )
} 