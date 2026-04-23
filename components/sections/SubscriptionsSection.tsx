'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Pagination from '@/components/shared/Pagination'

interface Subscription {
  id: string
  name: string
  description: string
  price: number
  total_slots: number
  filled_slots: number
  category: string
  created_at: string
  users: { id: string; name: string; image: string }
}

const LIMIT = 12

export default function SubscriptionsSection() {
  const { data: session } = useSession()
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
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
    fetchSubs(page)
  }, [page])

  const fetchSubs = async (p: number) => {
    setLoading(true)
    const res = await fetch(`/api/subscriptions?page=${p}`)
    const json = await res.json()
    setSubs(Array.isArray(json.data) ? json.data : [])
    setTotal(json.count || 0)
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
      fetchSubs(1)
      setPage(1)
    }
    setSubmitting(false)
  }

  const CATEGORIES = ['streaming', 'music', 'ai', 'productivity', 'gaming', 'other']

  return (
    <div>
      {/* Hero */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Share subscriptions. Save money.
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Split Netflix, Spotify, ChatGPT and more with trusted people. Post your plan, find members instantly.
        </p>
        <div className="flex gap-6">
          <div>
            <p className="text-xl font-bold text-gray-900">5,000+</p>
            <p className="text-xs text-gray-400">subscriptions shared</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">12k+</p>
            <p className="text-xs text-gray-400">members saved</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">avg ₹200</p>
            <p className="text-xs text-gray-400">saved per month</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Subscription Shares
          {total > 0 && <span className="text-sm font-normal text-gray-400 ml-2">({total} total)</span>}
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
          {[1,2,3,4,5,6].map(i => (
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
        <>
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
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{sub.description}</p>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div>
                    <p className="text-xs text-gray-400">{sub.users?.name}</p>
                    <p className="text-xs text-gray-400">{sub.filled_slots}/{sub.total_slots} slots filled</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-primary text-xs py-1.5 px-3">
                      Join
                    </button>
                    <button
                      onClick={() => window.location.href = `/messages?userId=${sub.users?.id}`}
                      className="btn-outline text-xs py-1.5 px-3"
                    >
                      💬
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            total={total}
            limit={LIMIT}
            onPage={(p) => {
              setPage(p)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </>
      )}
    </div>
  )
}
