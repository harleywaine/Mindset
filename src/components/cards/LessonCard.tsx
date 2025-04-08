'use client'

import { Check } from '@phosphor-icons/react'
import Link from 'next/link'

interface LessonCardProps {
  title: string
  duration: string
  type: string
  id: string
  completed?: boolean
}

export default function LessonCard({ title, duration, type, id, completed }: LessonCardProps) {
  return (
    <Link 
      href={`/play/${type}/${id}`}
      className="flex items-center justify-between p-4 rounded-lg bg-[#23262A] hover:bg-[#2B6D79]/10 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#1A1D20] flex items-center justify-center text-[#2B6D79]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5.14L19 12L8 18.86V5.14Z" fill="currentColor"/>
          </svg>
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-400">{duration}</p>
        </div>
      </div>
      {completed && (
        <Check size={20} weight="bold" className="text-[#2B6D79]" />
      )}
    </Link>
  )
} 