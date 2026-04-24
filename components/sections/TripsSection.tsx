'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Pagination from '@/components/shared/Pagination'

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
  currency: string
  description: string
  vehicle: string
  created_at: string
  users: { id: string; name: string; image: string }
}

const TYPE_ICONS: Record<string, string> = {
  carpool: '🚗',
  hotel: '🏨',
  flight: '✈️',
  buddy: '🧳',
}

const TYPE_LABELS: Record<string, string> = {
  carpool: 'Carpool',
  hotel: 'Hotel',
  flight: 'Flight',
  buddy: 'Travel Buddy',
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
  SGD: 'SGD ',
  AUD: 'A$',
}

const LIMIT = 12

export default function TripsSection() {
  const { data: session } = useSession()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    type: 'carpool',
    from_location: '',
    to_location: '',
    date: '',
    total_seats: '2',
    price: '',
    currency: 'USD',
    description: '',
    vehicle: '',
  })

  useEffect(() => {
    setPage(1)
    fetchTrips(1)
  }, [activeType])

  useEffect(() => {
    fetchTrips(page)
  }, [page])

  const fetchTrips = async (p: number) => {
    setLoading(true)
    const url = activeType === 'all'
      ? `/api/trips?page=${p}`
      : `/api/trips?type=${activeType}&page=${p}`
    const res = await fetch(url)
    const json = await res.json()
    setTrips(Array.isArray(json.data) ? json.data : [])
    setTotal(json.count || 0)
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!session) { signIn('google'); return }
    if (!form.title || !form.from_location || !form.to_location || !form.date) return

    setSubmitting(true)
    const res = await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        total_seats: parseInt(form.total_seats),
      }),
    })

    if (res.ok) {
      setForm({ title: '', type: 'carpool', from_location: '', to_location: '', date: '', total_seats: '2', price: '', currency: 'USD', description: '', vehicle: '' })
      setShowForm(false)
      fetchTrips(1)
      setPage(1)
    }
    setSubmitting(false)
  }

  const TYPES = ['all', 'carpool', 'hotel', 'flight', 'buddy']

  const getCurrencySymbol = (currency: string) => CURRENCY_SYMBOLS[currency] || currency + ' '

  return (
    <div>
      {/* Hero */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Share a trip. Split the cost.
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Find carpools, hotel rooms, flights, and travel buddies worldwide. Post your trip, let people join.
        </p>
        <div className="flex gap-6">
          <div>
            <p className="text-xl font-bold text-gray-900">1,200+</p>
            <p className="text-xs text-gray-400">trips posted</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">4.8k</p>
            <p className="text-xs text-gray-400">travellers matched</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">50%+</p>
            <p className="text-xs text-gray-400">avg cost saved</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 overflow-x-auto">
          {TYPES.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeType === type
                  ? 'bg-brand text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand'
              }`}
            >
              {type === 'all' ? '🌍 All' : `${TYPE_ICONS[type]} ${TYPE_LABELS[type]}`}
            </button>
          ))}
        </div>
        <button
          onClick={() => session ? setShowForm(!showForm) : signIn('google')}
          className="btn-primary shrink-0 ml-3"
        >
          + Post Trip
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Post a Trip</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="input sm:col-span-2"
              placeholder="Trip title (e.g. Delhi to Manali road trip)"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <select
              className="input"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="carpool">🚗 Carpool</option>
              <option value="hotel">🏨 Hotel Share</option>
              <option value="flight">✈️ Flight Share</option>
              <option value="buddy">🧳 Travel Buddy</option>
            </select>
            <input
              className="input"
              placeholder="Date (e.g. May 25, 2026)"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
            <input
              className="input"
              placeholder="From (city/location)"
              value={form.from_location}
              onChange={e => setForm({ ...form, from_location: e.target.value })}
            />
            <input
              className="input"
              placeholder="To (city/location)"
              value={form.to_location}
              onChange={e => setForm({ ...form, to_location: e.target.value })}
            />
            <input
              className="input"
              placeholder="Total seats/slots"
              type="number"
              value={form.total_seats}
              onChange={e => setForm({ ...form, total_seats: e.target.value })}
            />
            <div className="flex gap-2">
              <select
                className="input w-28 shrink-0"
                value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}
              >
                <option value="USD">$ USD</option>
                <option value="INR">₹ INR</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="AED">AED</option>
                <option value="SGD">SGD</option>
                <option value="AUD">A$ AUD</option>
              </select>
              <input
                className="input flex-1"
                placeholder="Price per person"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
              />
            </div>
            {form.type === 'carpool' && (
              <input
                className="input sm:col-span-2"
                placeholder="Vehicle (e.g. Toyota Innova, White)"
                value={form.vehicle}
                onChange={e => setForm({ ...form, vehicle: e.target.value })}
              />
            )}
            <textarea
              className="input sm:col-span-2"
              placeholder="Description (optional)"
              rows={2}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
              {submitting ? 'Posting...' : 'Post Trip'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </div>
      )}

      {/* Trips list */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse h-40" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">✈️</p>
          <p className="font-medium">No trips posted yet</p>
          <p className="text-sm mt-1">Be the first to post one!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map(trip => (
              <div key={trip.id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{TYPE_ICONS[trip.type]}</span>
                      <span className="badge badge-brand text-xs">{TYPE_LABELS[trip.type]}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{trip.title}</h3>
                  </div>
                  {trip.price && (
                    <p className="text-brand font-bold text-sm shrink-0">
                      {getCurrencySymbol(trip.currency || 'USD')}{trip.price}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="font-medium">{trip.from_location}</span>
                  <span>→</span>
                  <span className="font-medium">{trip.to_location}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span>📅 {trip.date}</span>
                  <span>👥 {trip.filled_seats}/{trip.total_seats} seats</span>
                </div>

                {trip.vehicle && (
                  <p className="text-xs text-gray-400 mb-2">🚗 {trip.vehicle}</p>
                )}

                {trip.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{trip.description}</p>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-400">{trip.users?.name}</p>
                  <div className="flex gap-2">
                    <button className="btn-primary text-xs py-1.5 px-3">Join</button>
                    <button
                      onClick={() => window.location.href = `/messages?userId=${trip.users?.id}`}
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
