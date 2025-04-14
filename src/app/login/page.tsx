'use client'

import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const { signIn, loading, user, session } = useAuth()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { error: signInError } = await signIn(email, password)
      
      if (signInError) {
        throw signInError
      }

      // Set redirecting state
      setIsRedirecting(true)

      // Wait for a moment to ensure session is established
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Get redirect path
      const redirectTo = searchParams.get('redirectTo')
      const targetPath = redirectTo ? decodeURIComponent(redirectTo) : '/'
      
      // Perform redirect
      window.location.replace(targetPath)
      
    } catch (err: any) {
      console.error('Sign in error:', err)
      setError(err.message || 'Failed to sign in')
      setIsLoading(false)
      setIsRedirecting(false)
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  // Show redirect state
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Redirecting to home...</div>
      </div>
    )
  }

  // If already authenticated, redirect immediately
  if (user && session?.access_token && !isRedirecting) {
    const redirectTo = searchParams.get('redirectTo')
    const targetPath = redirectTo ? decodeURIComponent(redirectTo) : '/'
    window.location.replace(targetPath)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/50 p-2 rounded">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || loading || isRedirecting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || loading ? 'Signing in...' : isRedirecting ? 'Redirecting...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 