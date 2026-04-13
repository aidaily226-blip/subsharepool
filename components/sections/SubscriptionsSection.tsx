'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'

interface Subscription {
  id: string
  name: string
  description: string
  price: number
  total_slots: number
  filled_slots: number
  category: string
  created_at: string
  users: { name: string; image: string }
}

export default function SubscriptionsSection() {
  const { data: session } = useSession()
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    total_slots: '2',
    category: 'streaming',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchSubs()
  }, [])

  const fetchSubs = async () => {
    setLoading(true)
    const res = await fetch('/api/subscriptions')
    const data = await res.json()
    setSubs(data)
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!session) { signIn('google'); return }
    if (!form.name) return

    setSubmitting(true)
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        total_slots: parseInt(form.total_slots),
      }),
    })

    if (res.ok) {
      setForm({ name: '', description: '', price: '', total_slots: '2', category: 'streaming' })
      setShowForm(false)
      fetchSubs()
    }
    setSubmitting(false)
  }

  const CATEGORIES = ['streaming', 'music', 'ai', 'productivity', 'gaming', 'other']

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Subscription Shares
        </h2>
        <button
          onClick={() => session ? setShowForm(!showForm) : signIn('google')}
          className="btn-primary"
        >
          + Post Share
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">New Subscription Share</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="Service name (e.g. Netflix)"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <select
              className="input"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Price per person (₹)"
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
            <input
              className="input"
              placeholder="Total slots"
              type="number"
              value={form.total_slots}
              onChange={e => setForm({ ...form, total_slots: e.target.value })}
            />
            <textarea
              className="input sm:col-span-2"
              placeholder="Description"
              rows={2}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
              {submitting ? 'Posting...' : 'Post'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : subs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-medium">No subscription shares yet</p>
          <p className="text-sm mt-1">Be the first to post one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subs.map(sub => (
            <div key={sub.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                  <span className="badge badge-brand">{sub.category}</span>
                </div>
                <p className="text-brand font-bold">₹{sub.price}<span className="text-xs text-gray-400">/mo</span></p>
              </div>
              {sub.description && (
                <p className="text-sm text-gray-500 mb-3">{sub.description}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-400">
                  {sub.filled_slots}/{sub.total_slots} slots filled
                </p>
                <button className="btn-primary text-xs py-1.5 px-3">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}