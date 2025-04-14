'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const { signIn, user, session, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const redirectAttempts = useRef(0)
  const initialized = useRef(false)

  useEffect(() => {
    // Skip initial render to avoid premature redirects
    if (!initialized.current) {
      initialized.current = true
      return
    }

    const handleRedirect = async () => {
      // Only proceed if we're not loading and have required session data
      if (loading || !session?.access_token || !user?.email) {
        return
      }

      // Prevent excessive redirect attempts
      if (redirectAttempts.current >= 3) {
        console.error('Max redirect attempts reached')
        return
      }

      redirectAttempts.current += 1
      console.log('Auth state:', {
        attempt: redirectAttempts.current,
        loading,
        hasSession: !!session,
        userEmail: user.email,
        accessToken: !!session.access_token
      })

      try {
        // Wait for initialization
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const redirectTo = searchParams.get('redirectTo')
        const targetPath = redirectTo ? decodeURIComponent(redirectTo) : '/'
        
        // Use router.push for the first attempts, fallback to window.location
        if (redirectAttempts.current < 2) {
          router.push(targetPath)
        } else {
          window.location.href = targetPath
        }
      } catch (error) {
        console.error('Redirect error:', error)
      }
    }

    handleRedirect()
  }, [loading, session, user, searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { error: signInError } = await signIn(email, password)
      if (signInError) {
        console.error('Sign in error:', signInError)
        throw signInError
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Invalid email or password')
      setIsLoading(false)
    }
  }

  // Show loading state during auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1D1F]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  // Show redirect message if authenticated
  if (!loading && session?.access_token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1D1F]">
        <div className="text-white text-lg">Redirecting to home...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1D1F] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-700 bg-[#23262A] text-white placeholder-gray-400 focus:outline-none focus:ring-[#2B6D79] focus:border-[#2B6D79] focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-700 bg-[#23262A] text-white placeholder-gray-400 focus:outline-none focus:ring-[#2B6D79] focus:border-[#2B6D79] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2B6D79] hover:bg-[#2B6D79]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B6D79] disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-[#2B6D79] hover:text-[#2B6D79]/80">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
} 