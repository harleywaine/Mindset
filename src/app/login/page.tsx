'use client'

import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect, useRef } from 'react'

// Debug logger
const debug = (message: string, data?: any) => {
  console.log(`[Login Debug] ${message}`, data || '')
}

export default function LoginPage() {
  const { signIn, loading, user, session } = useAuth()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const mountTime = useRef(Date.now())
  const redirectAttempts = useRef(0)

  // Track component lifecycle and auth state changes
  useEffect(() => {
    debug('Component mounted', {
      mountTime: new Date(mountTime.current).toISOString(),
      loading,
      hasUser: !!user,
      hasSession: !!session,
      searchParams: searchParams.toString()
    })

    return () => {
      debug('Component unmounting', {
        mountDuration: Date.now() - mountTime.current,
        redirectAttempts: redirectAttempts.current
      })
    }
  }, [])

  // Monitor auth state changes
  useEffect(() => {
    debug('Auth state changed', {
      loading,
      hasUser: !!user,
      hasSession: !!session,
      userEmail: user?.email,
      sessionStatus: session ? 'active' : 'none',
      isLoading
    })
  }, [loading, user, session, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) {
      debug('Submit blocked - already loading')
      return
    }

    debug('Starting sign in attempt', { email })
    setError('')
    setIsLoading(true)

    try {
      debug('Calling signIn')
      const { error: signInError, data } = await signIn(email, password)
      
      if (signInError) {
        debug('Sign in error received', signInError)
        throw signInError
      }

      debug('Sign in successful', { data })
      redirectAttempts.current++

      // Simple redirect after successful sign in
      const redirectTo = searchParams.get('redirectTo')
      const targetPath = redirectTo ? decodeURIComponent(redirectTo) : '/'
      
      debug('Attempting redirect', {
        attempt: redirectAttempts.current,
        targetPath,
        hasRedirectParam: !!redirectTo
      })

      // Add a small delay to ensure session is established
      await new Promise(resolve => setTimeout(resolve, 500))
      window.location.href = targetPath
      
    } catch (err: any) {
      console.error('Sign in error:', err)
      debug('Sign in error details', {
        message: err.message,
        code: err.code,
        stack: err.stack
      })
      setError(err.message || 'Failed to sign in')
      setIsLoading(false)
    }
  }

  // Show loading state
  if (loading || isLoading) {
    const state = loading ? 'auth-loading' : 'sign-in-loading'
    debug('Showing loading state', { state })
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">
          {isLoading ? 'Signing in...' : 'Loading...'}
        </div>
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
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-center text-sm text-gray-400">
              Debug: Mount time {new Date(mountTime.current).toLocaleTimeString()}
            </div>
          )}
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
              disabled={isLoading || loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-xs text-gray-400 space-y-1">
              <div>Debug Info:</div>
              <div>Loading: {loading ? 'true' : 'false'}</div>
              <div>Is Loading: {isLoading ? 'true' : 'false'}</div>
              <div>Has User: {user ? 'true' : 'false'}</div>
              <div>Has Session: {session ? 'true' : 'false'}</div>
              <div>Redirect Attempts: {redirectAttempts.current}</div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 