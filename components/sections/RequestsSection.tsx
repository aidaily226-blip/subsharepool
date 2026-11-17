'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'

interface Req {
  id: string
  service: string
  max_price: number | null
  currency: string
  note: string | null
  city: string | null
  created_at: string
  users: { id: string; name: string; image: string | null }
}

const SYMBOLS: Record<string, string> = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'AED ', SGD: 'SGD ', AUD: 'A$',
}
const QUICK = [
  'Netflix Premium', 'Spotify Family', 'ChatGPT Plus', 'YouTube Premium',
  'Canva Pro', 'Microsoft 365', 'Claude Pro', 'Carpool',
]

function ago(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  return `${Math.floor(h / 24)} days ago`
}

export default function RequestsSection() {
  const { data: session } = useSession()
  const [reqs, setReqs] = useState<Req[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ service: '', max_price: '', currency: 'INR', city: '', note: '' })

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/requests')
      const json = await res.json()
      setReqs(Array.isArray(json) ? json : [])
    } catch { setReqs([]) }
    setLoading(false)
  }

  const submit = async () => {
    if (!session) { signIn('google'); return }
    setError('')
    setSubmitting(true)
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const json = await res.json()
    if (res.ok) {
      setForm({ service: '', max_price: '', currency: 'INR', city: '', note: '' })
      setShowForm(false)
      load()
    } else {
      setError(json.error || 'Something went wrong. Try again.')
    }
    setSubmitting(false)
  }

  const reply = (r: Req) => {
    if (!session) { signIn('google'); return }
    window.location.href = `/messages?userId=${r.users.id}`
  }

  // Demand summary computed from real requests
  const counts = reqs.reduce<Record<string, number>>((acc, r) => {
    acc[r.service] = (acc[r.service] || 0) + 1
    return acc
  }, {})
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4)

  return (
    <div>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us what you want to split</h2>
        <p className="text-gray-500 text-sm mb-4 max-w-xl">
          You don't need to own a plan. Say what you're looking for and what you'd pay.
          Anyone who has a plan with a free seat can reply to you.
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Close' : 'Post a request'}
        </button>

        {top.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-sm font-bold text-gray-900 mb-2">
              {reqs.length} {reqs.length === 1 ? 'person is' : 'people are'} looking for a split right now
            </p>
            <div className="flex flex-wrap gap-2">
              {top.map(([service, n]) => (
                <span key={service} className="text-xs bg-brand/10 text-brand px-3 py-1 rounded-full font-medium">
                  {service} wanted by {n}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
          <p className="font-medium text-gray-900 mb-3">What do you want?</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK.map(q => (
              <button
                key={q}
                onClick={() => setForm({ ...form, service: q })}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  form.service === q
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="input sm:col-span-2"
              placeholder="Or type anything else (e.g. Adobe Creative Cloud)"
              value={form.service}
              onChange={e => setForm({ ...form, service: e.target.value })}
            />
            <div className="flex gap-2">
              <select
                className="input w-28 shrink-0"
                value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="AED">AED</option>
              </select>
              <input
                className="input flex-1"
                type="number"
                placeholder="Most I'd pay per month"
                value={form.max_price}
                onChange={e => setForm({ ...form, max_price: e.target.value })}
              />
            </div>
            <input
              className="input"
              placeholder="Your city (optional)"
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
            />
            <textarea
              className="input sm:col-span-2"
              rows={2}
              placeholder="Anything else? (optional)"
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
            />
          </div>
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
          <div className="flex gap-2 mt-3">
            <button onClick={submit} disabled={submitting || !form.service.trim()} className="btn-primary">
              {submitting ? 'Posting...' : session ? 'Post request' : 'Sign in and post'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-xl border border-gray-100 animate-pulse h-32" />)}
        </div>
      ) : reqs.length === 0 ? (
        <div className="text-center py-14">
          <p className="font-semibold text-gray-900 mb-1">No requests yet</p>
          <p className="text-sm text-gray-500 mb-4">Be the first to say what you want to split.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Post a request</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reqs.map(r => (
            <div key={r.id} className="card flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-gray-900 leading-snug">
                  {r.users.name} wants {r.service}
                </h3>
                {r.max_price ? (
                  <span className="shrink-0 text-sm font-bold text-brand bg-brand/10 px-2.5 py-1 rounded-lg">
                    up to {SYMBOLS[r.currency] || r.currency + ' '}{r.max_price}
                  </span>
                ) : null}
              </div>
              {r.note && <p className="text-sm text-gray-500 mb-2 line-clamp-3">{r.note}</p>}
              <p className="text-xs text-gray-400 mb-4">
                {r.city ? `${r.city}, ` : ''}{ago(r.created_at)}
              </p>
              <div className="mt-auto">
                <button onClick={() => reply(r)} className="btn-primary text-xs py-1.5 px-4 w-full">
                  I have this plan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
