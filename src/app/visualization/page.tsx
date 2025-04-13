'use client'

import { Check } from '@phosphor-icons/react'
import Link from 'next/link'
import LessonCard from '@/components/cards/LessonCard'

export default function Visualization() {
  const maintenanceSessions = [
    { title: 'Short Session', duration: '5 Minutes', type: 'maintenance', id: 'short' },
    { title: 'Medium Session', duration: '10 Minutes', type: 'maintenance', id: 'medium' },
    { title: 'Long Session', duration: '15 Minutes', type: 'maintenance', id: 'long' },
  ]

  const basicTraining = [
    { title: 'Introduction', duration: '20 Minutes', type: 'training', id: 'intro', completed: true },
    { title: 'Lesson 1', duration: '20 Minutes', type: 'training', id: 'lesson-1', completed: true },
    { title: 'Lesson 2', duration: '20 Minutes', type: 'training', id: 'lesson-2', completed: false },
    { title: 'Lesson 3', duration: '20 Minutes', type: 'training', id: 'lesson-3', completed: false },
  ]

  return (
    <>
      {/* Background Image */}
      <div 
        className="absolute top-0 left-0 right-0 w-full h-screen pointer-events-none"
        style={{
          backgroundImage: 'url(/grid2-bg.png)',
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
          <h1 className="text-2xl font-semibold">Visualization Training</h1>
          <p className="text-gray-400">Master the power of visualization</p>
        </div>

        {/* Maintenance Section */}
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

        {/* Basic Training Section */}
        <section>
          <h2 className="text-lg mb-4">Basic Training</h2>
          <div className="space-y-3">
            {basicTraining.map((lesson) => (
              <LessonCard
                key={lesson.id}
                title={lesson.title}
                duration={lesson.duration}
                type={lesson.type}
                id={lesson.id}
                completed={lesson.completed}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  )
} 