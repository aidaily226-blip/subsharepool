'use client'
import { signIn } from 'next-auth/react'

export default function LoginClient() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome to Sub<span className="text-brand">Share</span>Pool
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Sign in to post listings, join shares, and message people.
        </p>

        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.77-2.7.77-2.08 0-3.84-1.4-4.47-3.29H1.87v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.51 10.53A4.8 4.8 0 0 1 4.26 9c0-.53.09-1.05.25-1.53V5.4H1.87A8 8 0 0 0 .98 9c0 1.29.31 2.51.89 3.6l2.64-2.07z"/>
            <path fill="#EA4335" d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 8.98 1a8 8 0 0 0-7.11 4.39l2.64 2.07c.63-1.89 2.39-3.28 4.47-3.28z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-xs text-gray-400 mt-6">
          By signing in, you agree to our{' '}
          <a href="/terms" className="text-brand hover:underline">Terms</a>{' '}
          and{' '}
          <a href="/privacy" className="text-brand hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
