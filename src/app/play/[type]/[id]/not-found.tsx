import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Track Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the meditation track you're looking for.
        </p>
        <Link 
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
} 