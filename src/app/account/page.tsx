'use client'

import { useRouter } from 'next/navigation'

export default function Account() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-medium mb-1">Account</h1>
      </header>

      {/* User Info */}
      <div className="space-y-1">
        <h2 className="text-xl font-medium">Guest User</h2>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => router.push('/account/settings')}
          className="w-full py-4 px-4 rounded-lg bg-[#23262A] text-white font-medium hover:bg-[#2a2d31] transition-colors"
        >
          My Account
        </button>
      </div>
    </div>
  )
} 