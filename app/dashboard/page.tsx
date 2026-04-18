'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'

interface Subscription {
  id: string
  name: string
  description: string
  price: number
  total_slots: number
  filled_slots: number
  category: string
  created_at: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Subscription | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    total_slots: '2',
    category: 'streaming',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') fetchMySubs()
  }, [status])

  const fetchMySubs = async () => {
    setLoading(true)
    const res = await fetch('/api/my-subscriptions')
    const data = await res.json()
    setSubs(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!form.name) return
    setSubmitting(true)

    const url = editItem
      ? `/api/my-subscriptions/${editItem.id}`
      : '/api/my-subscriptions'

    const method = editItem ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
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
      setEditItem(null)
      fetchMySubs()
    }
    setSubmitting(false)
  }

  const handleEdit = (sub: Subscription) => {
    setEditItem(sub)
    setForm({
      name: sub.name,
      description: sub.description || '',
      price: sub.price?.toString() || '',
      total_slots: sub.total_slots?.toString() || '2',
      category: sub.category || 'streaming',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return
    await fetch(`/api/my-subscriptions/${id}`, { method: 'DELETE' })
    fetchMySubs()
  }

  const CATEGORIES = ['streaming', 'music', 'ai', 'productivity', 'gaming', 'other']

  if (status === 'loading') return (
    <div className="text-center py-16 text-gray-400">Loading...</div>
  )

  if (!session) return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">Please sign in to view your dashboard</p>
      <button onClick={() => signIn('google')} className="btn-primary">
        Sign in with Google
      </button>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your listings</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditItem(null); setForm({ name: '', description: '', price: '', total_slots: '2', category: 'streaming' }) }}
          className="btn-primary"
        >
          + New Listing
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">
            {editItem ? 'Edit Listing' : 'New Subscription Share'}
          </h3>
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
              {submitting ? 'Saving...' : editItem ? 'Update' : 'Post'}
            </button>
            <button onClick={() => { setShowForm(false); setEditItem(null) }} className="btn-outline">
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
          <p className="font-medium">No listings yet</p>
          <p className="text-sm mt-1">Click "New Listing" to create your first one!</p>
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
                <p className="text-brand font-bold">
                  ₹{sub.price}<span className="text-xs text-gray-400">/mo</span>
                </p>
              </div>
              {sub.description && (
                <p className="text-sm text-gray-500 mb-3">{sub.description}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-400">
                  {sub.filled_slots}/{sub.total_slots} slots filled
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(sub)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100">
        <Link href="/" className="text-sm text-brand hover:underline">
          ← Browse all listings
        </Link>
      </div>
    </div>
  )
}