'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Lightning, BatteryFull, ShieldCheck } from '@phosphor-icons/react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    try {
      setError('')
      setLoading(true)
      await signIn(email, password)
      setLoading(false)
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error?.message || error?.error_description || 'Failed to sign in')
      setLoading(false)
    }
  }

  // If user is logged in, show dashboard
  if (user) {
    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'
    
    const switches = [
      { name: 'Switch On', Icon: Lightning, href: '/switch-on' },
      { name: 'Switch Off', Icon: BatteryFull, href: '/switch-off' },
      { name: 'Take Control', Icon: ShieldCheck, href: '/take-control' },
    ]

    const foundations = [
      { title: 'Visualise the Race', duration: '20 Minutes', type: 'foundation', id: 'visualise-race', completed: true },
      { title: 'Confident Behaviour', duration: '20 Minutes', type: 'foundation', id: 'confident-behaviour', completed: true },
      { title: 'Training Breakthroughs', duration: '20 Minutes', type: 'foundation', id: 'training-breakthroughs', completed: false },
      { title: 'Overcoming Obstacles', duration: '20 Minutes', type: 'foundation', id: 'overcoming-obstacles', completed: false },
    ]

    return (
      <div className="min-h-screen bg-[#0A0A0A] p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Welcome back, {firstName}</h1>
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
              <div
                key={item.id}
                className="bg-[#1A1A1A] p-4 rounded-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.duration}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {item.completed && (
                    <span className="text-green-500">✓</span>
                  )}
                  <svg
                    className="w-5 h-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  // Login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#1A1A1A] rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-[#23262A] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#2B6D79] focus:border-transparent"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-[#23262A] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#2B6D79] focus:border-transparent"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#2B6D79] hover:bg-[#2B6D79]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B6D79] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link href="/signup" className="font-medium text-[#2B6D79] hover:text-[#2B6D79]/90">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 