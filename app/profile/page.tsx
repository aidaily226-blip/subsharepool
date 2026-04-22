'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getInitials } from '@/lib/utils'

interface UserProfile {
  id: string
  name: string
  email: string
  image: string
  username: string
  role: string
  created_at: string
}

interface Stats {
  subscriptions: number
  trips: number
  links: number
  feed_posts: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<Stats>({ subscriptions: 0, trips: 0, links: 0, feed_posts: 0 })
  const [loading, setLoading] = useState(true)
  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [savingUsername, setSavingUsername] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') fetchProfile()
  }, [status])

  const fetchProfile = async () => {
    setLoading(true)
    const res = await fetch('/api/profile')
    const data = await res.json()
if (data?.user?.id) {
      setProfile(data.user)
      setStats(data.stats)
      setNewUsername(data.user.username || '')
      setNewName(data.user.name || '')
    }
    setLoading(false)
  }

  const checkUsername = async (val: string) => {
    if (val.length < 3) { setUsernameAvailable(null); return }
    if (val === profile?.username) { setUsernameAvailable(true); return }
    setCheckingUsername(true)
    const res = await fetch(`/api/check-username?username=${val}`)
    const data = await res.json()
    setUsernameAvailable(data.available)
    setCheckingUsername(false)
  }

  const handleUsernameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setNewUsername(clean)
    setUsernameAvailable(null)
    if (clean.length >= 3) {
      clearTimeout((window as any)._ut)
      ;(window as any)._ut = setTimeout(() => checkUsername(clean), 500)
    }
  }

  const saveUsername = async () => {
    if (!usernameAvailable || newUsername.length < 3) return
    setSavingUsername(true)
    const res = await fetch('/api/set-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername }),
    })
    if (res.ok) {
      setMessage('Username updated!')
      setEditingUsername(false)
      fetchProfile()
    }
    setSavingUsername(false)
  }

  const saveName = async () => {
    if (!newName.trim()) return
    setSavingName(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    })
    if (res.ok) {
      setMessage('Name updated!')
      setEditingName(false)
      fetchProfile()
    }
    setSavingName(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') return
    setDeleting(true)
    const res = await fetch('/api/profile', { method: 'DELETE' })
    if (res.ok) {
      await signOut({ callbackUrl: '/' })
    }
    setDeleting(false)
  }

  if (status === 'loading' || loading) return (
    <div className="text-center py-16 text-gray-400">Loading...</div>
  )

  if (!session || !profile) return null

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

      {message && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
          <span>✅ {message}</span>
          <button onClick={() => setMessage('')} className="text-green-500">✕</button>
        </div>
      )}

      {/* Profile header */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {profile.image ? (
              <Image src={profile.image} alt={profile.name} width={72} height={72} className="rounded-full" />
            ) : (
              <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-brand text-white text-xl font-medium flex items-center justify-center">
                {getInitials(profile.name || 'U')}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex gap-2 mb-2">
                <input
                  className="input flex-1"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Your name"
                />
                <button onClick={saveName} disabled={savingName} className="btn-primary text-xs px-3">
                  {savingName ? '...' : 'Save'}
                </button>
                <button onClick={() => setEditingName(false)} className="btn-outline text-xs px-3">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
                <button onClick={() => setEditingName(true)} className="text-xs text-gray-400 hover:text-brand">✏️</button>
              </div>
            )}

            {editingUsername ? (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                  <input
                    className="input pl-7"
                    value={newUsername}
                    onChange={e => handleUsernameChange(e.target.value)}
                    maxLength={20}
                  />
                  {checkingUsername && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">...</span>}
                  {!checkingUsername && usernameAvailable === true && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-500">✓</span>}
                  {!checkingUsername && usernameAvailable === false && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500">✗</span>}
                </div>
                <button onClick={saveUsername} disabled={!usernameAvailable || savingUsername || newUsername.length < 3} className="btn-primary text-xs px-3">
                  {savingUsername ? '...' : 'Save'}
                </button>
                <button onClick={() => setEditingUsername(false)} className="btn-outline text-xs px-3">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">
                  {profile.username ? `@${profile.username}` : <span className="text-orange-400">No username set</span>}
                </p>
                <button onClick={() => setEditingUsername(true)} className="text-xs text-gray-400 hover:text-brand">✏️</button>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-1">{profile.email}</p>
            {profile.role === 'admin' && (
              <span className="badge bg-purple-50 text-purple-700 text-xs mt-1">Admin</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
          <span>📅 Joined</span>
          <span>{new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Subscriptions', value: stats.subscriptions, icon: '📦' },
          { label: 'Trips', value: stats.trips, icon: '✈️' },
          { label: 'Links', value: stats.links, icon: '🔗' },
          { label: 'Posts', value: stats.feed_posts, icon: '💬' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-3 text-center">
            <p className="text-lg mb-0.5">{stat.icon}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4">
        <button onClick={() => router.push('/dashboard')} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
          <span className="text-sm text-gray-700">📦 My Dashboard</span>
          <span className="text-gray-300">›</span>
        </button>
        <button onClick={() => router.push('/messages')} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
          <span className="text-sm text-gray-700">💬 Messages</span>
          <span className="text-gray-300">›</span>
        </button>
        {profile.role === 'admin' && (
          <button onClick={() => router.push('/admin')} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
            <span className="text-sm text-gray-700">🛡️ Admin Panel</span>
            <span className="text-gray-300">›</span>
          </button>
        )}
        <button onClick={() => router.push('/setup')} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
          <span className="text-sm text-gray-700">⚙️ Change Username</span>
          <span className="text-gray-300">›</span>
        </button>
      </div>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 text-left mb-4"
      >
        🚪 Sign out
      </button>

      {/* Danger zone */}
      <div className="bg-white border border-red-100 rounded-2xl p-4">
        <h3 className="text-sm font-medium text-red-600 mb-1">Danger Zone</h3>
        <p className="text-xs text-gray-400 mb-3">Deleting your account is permanent and cannot be undone. All your listings, messages and data will be deleted.</p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs px-4 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
          >
            Delete my account
          </button>
        ) : (
          <div>
            <p className="text-xs text-gray-600 mb-2">Type <strong>DELETE</strong> to confirm:</p>
            <input
              className="input mb-2"
              placeholder="Type DELETE"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteInput !== 'DELETE' || deleting}
                className="text-xs px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, delete my account'}
              </button>
              <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput('') }} className="btn-outline text-xs">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
