'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'

interface Creator {
  id: string
  display_name: string
  handle: string | null
  platform: string
  niche: string
  followers: number
  link: string
  bio: string | null
  open_to: string[] | null
  users: { id: string; name: string; image: string | null }
}

const PLATFORMS = ['Instagram', 'YouTube', 'TikTok', 'X', 'LinkedIn', 'Blog']
const NICHES = ['Travel', 'Food', 'Tech', 'Finance', 'Fitness', 'Gaming', 'Fashion', 'Education', 'Lifestyle']
const OPEN_TO = ['Sponsored posts', 'Affiliate deals', 'Barter and free products', 'Collabs with other creators']

// Full class names so Tailwind keeps them
const TINTS = ['bg-purple-500', 'bg-rose-500', 'bg-emerald-600', 'bg-amber-500', 'bg-sky-600', 'bg-fuchsia-600']
const tint = (s: string) => TINTS[(s.charCodeAt(0) + s.length) % TINTS.length]

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

export default function CreatorsSection() {
  const { data: session } = useSession()
  const [list, setList] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [niche, setNiche] = useState('All')
  const [platform, setPlatform] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    display_name: '', handle: '', platform: 'Instagram', niche: 'Travel',
    followers: '', link: '', bio: '', open_to: [] as string[],
  })

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/influencers')
      const json = await res.json()
      setList(Array.isArray(json) ? json : [])
    } catch { setList([]) }
    setLoading(false)
  }

  const toggleOpen = (v: string) =>
    setForm(f => ({ ...f, open_to: f.open_to.includes(v) ? f.open_to.filter(x => x !== v) : [...f.open_to, v] }))

  const submit = async () => {
    if (!session) { signIn('google'); return }
    setError('')
    setSubmitting(true)
    const res = await fetch('/api/influencers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const json = await res.json()
    if (res.ok) { setShowForm(false); load() }
    else setError(json.error || 'Something went wrong. Try again.')
    setSubmitting(false)
  }

  const filtered = list.filter(c =>
    (niche === 'All' || c.niche === niche) && (platform === 'All' || c.platform === platform)
  )
  const total = list.reduce((s, c) => s + (c.followers || 0), 0)

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors ${
      active ? 'bg-brand text-white border-brand' : 'bg-white text-gray-600 border-gray-200 hover:border-brand'
    }`

  return (
    <div>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Creators looking to collaborate</h2>
        <p className="text-gray-500 text-sm mb-4 max-w-xl">
          Small and growing creators, listed by what they make and what they're open to.
          Brands, shops and other creators can reach out directly. Listing is free.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Close' : 'Add your creator profile'}
          </button>
          {list.length > 0 && (
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900">{list.length}</span> {list.length === 1 ? 'creator' : 'creators'} with a combined audience of{' '}
              <span className="font-bold text-gray-900">{fmt(total)}</span>
            </p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="input" placeholder="Your name or channel name" value={form.display_name}
              onChange={e => setForm({ ...form, display_name: e.target.value })} />
            <input className="input" placeholder="Handle (@yourname)" value={form.handle}
              onChange={e => setForm({ ...form, handle: e.target.value })} />
            <select className="input" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
            <select className="input" value={form.niche} onChange={e => setForm({ ...form, niche: e.target.value })}>
              {NICHES.map(n => <option key={n}>{n}</option>)}
            </select>
            <input className="input" type="number" placeholder="Followers or subscribers" value={form.followers}
              onChange={e => setForm({ ...form, followers: e.target.value })} />
            <input className="input" placeholder="Link to your profile (https://...)" value={form.link}
              onChange={e => setForm({ ...form, link: e.target.value })} />
            <textarea className="input sm:col-span-2" rows={2} placeholder="What do you make? One or two lines."
              value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>
          <p className="text-sm font-medium text-gray-900 mt-4 mb-2">Open to</p>
          <div className="flex flex-wrap gap-2">
            {OPEN_TO.map(o => (
              <button key={o} onClick={() => toggleOpen(o)} className={chip(form.open_to.includes(o))}>{o}</button>
            ))}
          </div>
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
          <div className="flex gap-2 mt-4">
            <button onClick={submit} disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : session ? 'Save profile' : 'Sign in and save'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
        {['All', ...NICHES].map(n => <button key={n} onClick={() => setNiche(n)} className={chip(niche === n)}>{n}</button>)}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {['All', ...PLATFORMS].map(p => <button key={p} onClick={() => setPlatform(p)} className={chip(platform === p)}>{p}</button>)}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-xl border border-gray-100 animate-pulse h-48" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14">
          <p className="font-semibold text-gray-900 mb-1">
            {list.length === 0 ? 'No creators listed yet' : 'No creators match these filters'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {list.length === 0 ? 'Add your profile and be the first one brands see.' : 'Try a different niche or platform.'}
          </p>
          {list.length === 0 && <button onClick={() => setShowForm(true)} className="btn-primary">Add your creator profile</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="card flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full ${tint(c.display_name)} text-white font-bold text-lg flex items-center justify-center shrink-0`}>
                  {c.display_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{c.display_name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.handle || c.platform}</p>
                </div>
                <div className="ml-auto text-right shrink-0">
                  <p className="text-lg font-bold text-gray-900 leading-none">{fmt(c.followers)}</p>
                  <p className="text-xs text-gray-400">on {c.platform}</p>
                </div>
              </div>
              <span className="badge badge-brand text-xs self-start mb-2">{c.niche}</span>
              {c.bio && <p className="text-sm text-gray-500 mb-3 line-clamp-3">{c.bio}</p>}
              {c.open_to && c.open_to.length > 0 && (
                <p className="text-xs text-gray-500 mb-3">
                  <span className="font-semibold text-gray-700">Open to </span>
                  {c.open_to.join(', ').toLowerCase()}
                </p>
              )}
              <div className="mt-auto flex gap-2 pt-3 border-t border-gray-50">
                <a href={c.link} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs py-1.5 px-4 flex-1 text-center">
                  See their work
                </a>
                <button
                  onClick={() => session ? (window.location.href = `/messages?userId=${c.users?.id}`) : signIn('google')}
                  className="btn-primary text-xs py-1.5 px-4 flex-1"
                >
                  Work together
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
