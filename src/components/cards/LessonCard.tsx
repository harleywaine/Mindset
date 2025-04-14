'use client'

import { Check } from '@phosphor-icons/react'
import Link from 'next/link'

interface LessonCardProps {
  title: string
  duration: string
  type: string
  id: string | number
  completed?: boolean
}

export default function LessonCard({ title, duration, type, id, completed }: LessonCardProps) {
  return (
    <Link 
      href={`/play/${type}/${id}`}
      className="flex items-center justify-between p-4 rounded-xl bg-[#23262A] hover:bg-[#2B6D79]/10 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#1A1D20] flex items-center justify-center text-[#2B6D79]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5.14L19 12L8 18.86V5.14Z" fill="currentColor"/>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <p className="text-base text-gray-400">{duration}</p>
        </div>
      </div>
      {completed && (
        <div className="w-8 h-8 rounded-full border-2 border-[#2B6D79] flex items-center justify-center">
          <Check size={16} weight="bold" className="text-[#2B6D79]" />
        </div>
      )}
    </Link>
  )
} 