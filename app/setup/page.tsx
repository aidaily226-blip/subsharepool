'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status])

  const checkUsername = async (val: string) => {
    if (val.length < 3) { setAvailable(null); return }
    setChecking(true)
    const res = await fetch(`/api/check-username?username=${val}`)
    const data = await res.json()
    setAvailable(data.available)
    setChecking(false)
  }

  const handleChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(clean)
    setAvailable(null)
    if (clean.length >= 3) {
      clearTimeout((window as any)._ut)
      ;(window as any)._ut = setTimeout(() => checkUsername(clean), 500)
    }
  }

  const handleSave = async () => {
    if (!available || username.length < 3) return
    setSaving(true)
    const res = await fetch('/api/set-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
    if (res.ok) {
      router.push('/dashboard')
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to save')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Choose your username</h1>
        <p className="text-sm text-gray-400 mb-6">This is your unique ID on SubSharePool</p>

        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
          <input
            className="input pl-7"
            placeholder="yourname"
            value={username}
            onChange={e => handleChange(e.target.value)}
            maxLength={20}
          />
          {checking && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">checking...</span>
          )}
          {!checking && available === true && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-500">✓ Available</span>
          )}
          {!checking && available === false && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500">✗ Taken</span>
          )}
        </div>

        <p className="text-xs text-gray-400 mb-6">Only letters, numbers and underscores. Min 3 characters.</p>

        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <button
          onClick={handleSave}
          disabled={!available || saving || username.length < 3}
          className="btn-primary w-full"
        >
          {saving ? 'Saving...' : 'Save username'}
        </button>
      </div>
    </div>
  )
}