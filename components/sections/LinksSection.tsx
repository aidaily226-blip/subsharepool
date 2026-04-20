'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'

interface LinkItem {
  id: string
  name: string
  handle: string
  type: string
  description: string
  url: string
  stat: string
  created_at: string
  users: { id: string; name: string; image: string }
}

const TYPE_ICONS: Record<string, string> = {
  portfolio: '🎨',
  collab: '🤝',
  referral: '🎁',
  youtube: '▶️',
  instagram: '📸',
  github: '💻',
  linkedin: '💼',
  other: '🔗',
}

const TYPES = ['portfolio', 'collab', 'referral', 'youtube', 'instagram', 'github', 'linkedin', 'other']

export default function LinksSection() {
  const { data: session } = useSession()
  const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    handle: '',
    type: 'portfolio',
    description: '',
    url: '',
    stat: '',
  })

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    setLoading(true)
    const res = await fetch('/api/links')
    const data = await res.json()
    setLinks(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!session) { signIn('google'); return }
    if (!form.name || !form.url) return
    setSubmitting(true)
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ name: '', handle: '', type: 'portfolio', description: '', url: '', stat: '' })
      setShowForm(false)
      fetchLinks()
    }
    setSubmitting(false)
  }

  const filtered = activeType === 'all' ? links : links.filter(l => l.type === activeType)

  return (
    <div>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Share your links. Grow together.</h2>
        <p className="text-gray-400 text-sm mb-4">Share your portfolio, find collaborators, post referral links, and connect with creators.</p>
        <div className="flex gap-6">
          <div><p className="text-xl font-bold text-gray-900">3,200+</p><p className="text-xs text-gray-400">links shared</p></div>
          <div><p className="text-xl font-bold text-gray-900">800+</p><p className="text-xs text-gray-400">collabs found</p></div>
          <div><p className="text-xl font-bold text-gray-900">15k+</p><p className="text-xs text-gray-400">referrals earned</p></div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => setActiveType('all')} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${activeType === 'all' ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>All</button>
          {TYPES.map(type => (
            <button key={type} onClick={() => setActiveType(type)} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${activeType === type ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
              {TYPE_ICONS[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={() => session ? setShowForm(!showForm) : signIn('google')} className="btn-primary shrink-0 ml-3">+ Share Link</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Share a Link</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="input" placeholder="Name (e.g. My Portfolio)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <input className="input" placeholder="URL (https://...)" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
            <input className="input" placeholder="Handle (@username)" value={form.handle} onChange={e => setForm({ ...form, handle: e.target.value })} />
            <input className="input" placeholder="Stat (e.g. 10k followers)" value={form.stat} onChange={e => setForm({ ...form, stat: e.target.value })} />
            <textarea className="input" placeholder="Description" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary">{submitting ? 'Sharing...' : 'Share'}</button>
            <button onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse h-32" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔗</p>
          <p className="font-medium">No links yet</p>
          <p className="text-sm mt-1">Be the first to share one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(link => (
            <div key={link.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{TYPE_ICONS[link.type] || '🔗'}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{link.name}</h3>
                    {link.handle && <p className="text-xs text-gray-400">{link.handle}</p>}
                  </div>
                </div>
                <span className="badge badge-brand text-xs">{link.type}</span>
              </div>
              {link.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{link.description}</p>}
              {link.stat && <p className="text-xs text-brand font-medium mb-3">⭐ {link.stat}</p>}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400">{link.users?.name}</p>
                <div className="flex gap-2">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-1.5 px-3">Visit</a>
                  <button onClick={() => window.location.href = `/messages?userId=${link.users?.id}`} className="btn-outline text-xs py-1.5 px-3">💬</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
