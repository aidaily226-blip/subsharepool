'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'

export default function FloatingBar() {
  const { data: session } = useSession()
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400 && !dismissed) {
        setShow(true)
      } else {
        setShow(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dismissed])

  if (session || dismissed || !show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gray-900 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Join free — start saving today</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">70+ members already splitting costs worldwide</p>
        </div>
        <button
          onClick={() => signIn('google')}
          className="bg-brand text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-brand-dark transition-colors shrink-0"
        >
          Join free
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-500 hover:text-gray-300 shrink-0 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}
