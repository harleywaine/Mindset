'use client'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-md p-6">
          <h2 className="text-xl font-bold mb-2">Page Not Found</h2>
          <p>
            The page you're looking for doesn't exist. Please check the URL and try again.
          </p>
        </div>
      </div>
    </div>
  )
} 