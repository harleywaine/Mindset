export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-md p-6">
          <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
          <p>
            There was a problem with your authentication link. Please try signing in again
            or contact support if the problem persists.
          </p>
        </div>
      </div>
    </div>
  )
} 