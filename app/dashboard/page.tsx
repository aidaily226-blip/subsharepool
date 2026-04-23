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
}

interface Trip {
  id: string
  title: string
  type: string
  from_location: string
  to_location: string
  date: string
  total_seats: number
  filled_seats: number
  price: string
  description: string
  vehicle: string
}

interface LinkItem {
  id: string
  name: string
  handle: string
  type: string
  description: string
  url: string
  stat: string
}

const TYPE_ICONS: Record<string, string> = {
  carpool: '🚗',
  hotel: '🏨',
  flight: '✈️',
  buddy: '🧳',
}

const LINK_TYPES = ['portfolio', 'collab', 'referral', 'youtube', 'instagram', 'github', 'linkedin', 'other']
const CATEGORIES = ['streaming', 'music', 'ai', 'productivity', 'gaming', 'other']

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'subs' | 'trips' | 'links'>('subs')

  const [subs, setSubs] = useState<Subscription[]>([])
  const [subsLoading, setSubsLoading] = useState(true)
  const [showSubForm, setShowSubForm] = useState(false)
  const [editSub, setEditSub] = useState<Subscription | null>(null)
  const [subForm, setSubForm] = useState({ name: '', description: '', price: '', total_slots: '2', category: 'streaming' })

  const [trips, setTrips] = useState<Trip[]>([])
  const [tripsLoading, setTripsLoading] = useState(true)
  const [showTripForm, setShowTripForm] = useState(false)
  const [editTrip, setEditTrip] = useState<Trip | null>(null)
  const [tripForm, setTripForm] = useState({ title: '', type: 'carpool', from_location: '', to_location: '', date: '', total_seats: '2', price: '', description: '', vehicle: '' })

  const [links, setLinks] = useState<LinkItem[]>([])
  const [linksLoading, setLinksLoading] = useState(true)
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [editLink, setEditLink] = useState<LinkItem | null>(null)
  const [linkForm, setLinkForm] = useState({ name: '', handle: '', type: 'portfolio', description: '', url: '', stat: '' })

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSubs()
      fetchTrips()
      fetchLinks()
    }
  }, [status])

  const fetchSubs = async () => {
    setSubsLoading(true)
    const res = await fetch('/api/my-subscriptions')
    const data = await res.json()
    setSubs(Array.isArray(data) ? data : [])
    setSubsLoading(false)
  }

  const fetchTrips = async () => {
    setTripsLoading(true)
    const res = await fetch('/api/my-trips')
    const data = await res.json()
    setTrips(Array.isArray(data) ? data : [])
    setTripsLoading(false)
  }

  const fetchLinks = async () => {
    setLinksLoading(true)
    const res = await fetch('/api/my-links')
    const data = await res.json()
    setLinks(Array.isArray(data) ? data : [])
    setLinksLoading(false)
  }

  const handleSubSubmit = async () => {
    if (!subForm.name) return
    setSubmitting(true)
    const url = editSub ? `/api/my-subscriptions/${editSub.id}` : '/api/my-subscriptions'
    const method = editSub ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...subForm, price: parseFloat(subForm.price), total_slots: parseInt(subForm.total_slots) }),
    })
    if (res.ok) {
      setSubForm({ name: '', description: '', price: '', total_slots: '2', category: 'streaming' })
      setShowSubForm(false)
      setEditSub(null)
      fetchSubs()
    }
    setSubmitting(false)
  }

  const handleTripSubmit = async () => {
    if (!tripForm.title || !tripForm.from_location || !tripForm.to_location || !tripForm.date) return
    setSubmitting(true)
    const url = editTrip ? `/api/my-trips/${editTrip.id}` : '/api/my-trips'
    const method = editTrip ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...tripForm, total_seats: parseInt(tripForm.total_seats) }),
    })
    if (res.ok) {
      setTripForm({ title: '', type: 'carpool', from_location: '', to_location: '', date: '', total_seats: '2', price: '', description: '', vehicle: '' })
      setShowTripForm(false)
      setEditTrip(null)
      fetchTrips()
    }
    setSubmitting(false)
  }

  const handleLinkSubmit = async () => {
    if (!linkForm.name || !linkForm.url) return
    setSubmitting(true)
    const url = editLink ? `/api/my-links/${editLink.id}` : '/api/my-links'
    const method = editLink ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(linkForm),
    })
    if (res.ok) {
      setLinkForm({ name: '', handle: '', type: 'portfolio', description: '', url: '', stat: '' })
      setShowLinkForm(false)
      setEditLink(null)
      fetchLinks()
    }
    setSubmitting(false)
  }

  const handleEditSub = (sub: Subscription) => {
    setEditSub(sub)
    setSubForm({ name: sub.name, description: sub.description || '', price: sub.price?.toString() || '', total_slots: sub.total_slots?.toString() || '2', category: sub.category || 'streaming' })
    setShowSubForm(true)
  }

  const handleDeleteSub = async (id: string) => {
    if (!confirm('Delete this listing?')) return
    await fetch(`/api/my-subscriptions/${id}`, { method: 'DELETE' })
    fetchSubs()
  }

  const handleEditTrip = (trip: Trip) => {
    setEditTrip(trip)
    setTripForm({ title: trip.title, type: trip.type, from_location: trip.from_location, to_location: trip.to_location, date: trip.date, total_seats: trip.total_seats?.toString() || '2', price: trip.price || '', description: trip.description || '', vehicle: trip.vehicle || '' })
    setShowTripForm(true)
  }

  const handleDeleteTrip = async (id: string) => {
    if (!confirm('Delete this trip?')) return
    await fetch(`/api/my-trips/${id}`, { method: 'DELETE' })
    fetchTrips()
  }

  const handleEditLink = (link: LinkItem) => {
    setEditLink(link)
    setLinkForm({ name: link.name, handle: link.handle || '', type: link.type, description: link.description || '', url: link.url, stat: link.stat || '' })
    setShowLinkForm(true)
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Delete this link?')) return
    await fetch(`/api/my-links/${id}`, { method: 'DELETE' })
    fetchLinks()
  }

  if (status === 'loading') return <div className="text-center py-16 text-gray-400">Loading...</div>

  if (!session) return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">Please sign in to view your dashboard</p>
      <button onClick={() => signIn('google')} className="btn-primary">Sign in with Google</button>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your listings</p>
        </div>
      </div>

<div className="flex gap-2 mb-6 border-b border-gray-100 overflow-x-auto">
  <button
    onClick={() => setActiveTab('subs')}
    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors shrink-0 ${
      activeTab === 'subs'
        ? 'border-brand text-brand bg-brand/5'
        : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
    }`}
  >
    📦 My Subscriptions
  </button>
  <button
    onClick={() => setActiveTab('trips')}
    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors shrink-0 ${
      activeTab === 'trips'
        ? 'border-brand text-brand bg-brand/5'
        : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
    }`}
  >
    ✈️ My Trips
  </button>
  <button
    onClick={() => setActiveTab('links')}
    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors shrink-0 ${
      activeTab === 'links'
        ? 'border-brand text-brand bg-brand/5'
        : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
    }`}
  >
    🔗 My Links
  </button>
  <button
    onClick={() => window.location.href = '/messages'}
    className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-brand hover:border-brand hover:bg-brand/5 transition-colors shrink-0"
  >
    💬 Messages
  </button>
  <button
    onClick={() => window.location.href = '/profile'}
    className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-brand hover:border-brand hover:bg-brand/5 transition-colors shrink-0"
  >
    👤 Profile
  </button>
</div>

      {activeTab === 'subs' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setShowSubForm(!showSubForm); setEditSub(null); setSubForm({ name: '', description: '', price: '', total_slots: '2', category: 'streaming' }) }} className="btn-primary">+ New Subscription</button>
          </div>
          {showSubForm && (
            <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">{editSub ? 'Edit Subscription' : 'New Subscription'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="input" placeholder="Service name" value={subForm.name} onChange={e => setSubForm({ ...subForm, name: e.target.value })} />
                <select className="input" value={subForm.category} onChange={e => setSubForm({ ...subForm, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                <input className="input" placeholder="Price per person (₹)" type="number" value={subForm.price} onChange={e => setSubForm({ ...subForm, price: e.target.value })} />
                <input className="input" placeholder="Total slots" type="number" value={subForm.total_slots} onChange={e => setSubForm({ ...subForm, total_slots: e.target.value })} />
                <textarea className="input sm:col-span-2" placeholder="Description" rows={2} value={subForm.description} onChange={e => setSubForm({ ...subForm, description: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={handleSubSubmit} disabled={submitting} className="btn-primary">{submitting ? 'Saving...' : editSub ? 'Update' : 'Post'}</button>
                <button onClick={() => { setShowSubForm(false); setEditSub(null) }} className="btn-outline">Cancel</button>
              </div>
            </div>
          )}
          {subsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse h-32" />)}
            </div>
          ) : subs.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📦</p><p className="font-medium">No subscriptions yet</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subs.map(sub => (
                <div key={sub.id} className="card">
                  <div className="flex items-start justify-between mb-2">
                    <div><h3 className="font-semibold text-gray-900">{sub.name}</h3><span className="badge badge-brand">{sub.category}</span></div>
                    <p className="text-brand font-bold">₹{sub.price}<span className="text-xs text-gray-400">/mo</span></p>
                  </div>
                  {sub.description && <p className="text-sm text-gray-500 mb-3">{sub.description}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-400">{sub.filled_slots}/{sub.total_slots} slots</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditSub(sub)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Edit</button>
                      <button onClick={() => handleDeleteSub(sub.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'trips' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setShowTripForm(!showTripForm); setEditTrip(null); setTripForm({ title: '', type: 'carpool', from_location: '', to_location: '', date: '', total_seats: '2', price: '', description: '', vehicle: '' }) }} className="btn-primary">+ New Trip</button>
          </div>
          {showTripForm && (
            <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">{editTrip ? 'Edit Trip' : 'New Trip'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="input sm:col-span-2" placeholder="Trip title" value={tripForm.title} onChange={e => setTripForm({ ...tripForm, title: e.target.value })} />
                <select className="input" value={tripForm.type} onChange={e => setTripForm({ ...tripForm, type: e.target.value })}>
                  <option value="carpool">🚗 Carpool</option>
                  <option value="hotel">🏨 Hotel Share</option>
                  <option value="flight">✈️ Flight Share</option>
                  <option value="buddy">🧳 Travel Buddy</option>
                </select>
                <input className="input" placeholder="Date" value={tripForm.date} onChange={e => setTripForm({ ...tripForm, date: e.target.value })} />
                <input className="input" placeholder="From" value={tripForm.from_location} onChange={e => setTripForm({ ...tripForm, from_location: e.target.value })} />
                <input className="input" placeholder="To" value={tripForm.to_location} onChange={e => setTripForm({ ...tripForm, to_location: e.target.value })} />
                <input className="input" placeholder="Total seats" type="number" value={tripForm.total_seats} onChange={e => setTripForm({ ...tripForm, total_seats: e.target.value })} />
                <input className="input" placeholder="Price per person (₹)" value={tripForm.price} onChange={e => setTripForm({ ...tripForm, price: e.target.value })} />
                <input className="input sm:col-span-2" placeholder="Vehicle (for carpools)" value={tripForm.vehicle} onChange={e => setTripForm({ ...tripForm, vehicle: e.target.value })} />
                <textarea className="input sm:col-span-2" placeholder="Description" rows={2} value={tripForm.description} onChange={e => setTripForm({ ...tripForm, description: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={handleTripSubmit} disabled={submitting} className="btn-primary">{submitting ? 'Saving...' : editTrip ? 'Update' : 'Post'}</button>
                <button onClick={() => { setShowTripForm(false); setEditTrip(null) }} className="btn-outline">Cancel</button>
              </div>
            </div>
          )}
          {tripsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse h-32" />)}
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">✈️</p><p className="font-medium">No trips yet</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map(trip => (
                <div key={trip.id} className="card">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1"><span>{TYPE_ICONS[trip.type]}</span><span className="badge badge-brand text-xs">{trip.type}</span></div>
                      <h3 className="font-semibold text-gray-900 text-sm">{trip.title}</h3>
                    </div>
                    {trip.price && <p className="text-brand font-bold text-sm">₹{trip.price}</p>}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{trip.from_location} → {trip.to_location}</p>
                  <p className="text-xs text-gray-400 mb-3">📅 {trip.date} · 👥 {trip.filled_seats}/{trip.total_seats}</p>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEditTrip(trip)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Edit</button>
                    <button onClick={() => handleDeleteTrip(trip.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'links' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setShowLinkForm(!showLinkForm); setEditLink(null); setLinkForm({ name: '', handle: '', type: 'portfolio', description: '', url: '', stat: '' }) }} className="btn-primary">+ New Link</button>
          </div>
          {showLinkForm && (
            <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">{editLink ? 'Edit Link' : 'New Link'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="input" placeholder="Name" value={linkForm.name} onChange={e => setLinkForm({ ...linkForm, name: e.target.value })} />
                <select className="input" value={linkForm.type} onChange={e => setLinkForm({ ...linkForm, type: e.target.value })}>
                  {LINK_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
                <input className="input" placeholder="URL (https://...)" value={linkForm.url} onChange={e => setLinkForm({ ...linkForm, url: e.target.value })} />
                <input className="input" placeholder="Handle (@username)" value={linkForm.handle} onChange={e => setLinkForm({ ...linkForm, handle: e.target.value })} />
                <input className="input" placeholder="Stat (e.g. 10k followers)" value={linkForm.stat} onChange={e => setLinkForm({ ...linkForm, stat: e.target.value })} />
                <textarea className="input" placeholder="Description" rows={2} value={linkForm.description} onChange={e => setLinkForm({ ...linkForm, description: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={handleLinkSubmit} disabled={submitting} className="btn-primary">{submitting ? 'Saving...' : editLink ? 'Update' : 'Share'}</button>
                <button onClick={() => { setShowLinkForm(false); setEditLink(null) }} className="btn-outline">Cancel</button>
              </div>
            </div>
          )}
          {linksLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse h-32" />)}
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">🔗</p><p className="font-medium">No links yet</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {links.map(link => (
                <div key={link.id} className="card">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{link.name}</h3>
                    <span className="badge badge-brand text-xs">{link.type}</span>
                  </div>
                  {link.handle && <p className="text-xs text-gray-400 mb-1">{link.handle}</p>}
                  {link.stat && <p className="text-xs text-brand mb-2">⭐ {link.stat}</p>}
                  {link.description && <p className="text-xs text-gray-500 mb-3">{link.description}</p>}
                  <div className="flex justify-end gap-2 mt-3">
                    <button onClick={() => handleEditLink(link)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Edit</button>
                    <button onClick={() => handleDeleteLink(link.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100">
        <Link href="/" className="text-sm text-brand hover:underline">← Browse all listings</Link>
      </div>
    </div>
  )
}
