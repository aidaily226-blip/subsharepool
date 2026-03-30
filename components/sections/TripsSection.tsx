'use client'
import { useState } from 'react'
import Hero from '@/components/shared/Hero'
import FilterBar from '@/components/shared/FilterBar'

const TYPES = [
  { value: 'all', label: 'All' },
  { value: 'carpool', label: '🚗 Carpool' },
  { value: 'hotel', label: '🏨 Hotel' },
  { value: 'flight', label: '✈️ Flight' },
  { value: 'buddy', label: '🧳 Travel Buddy' },
]

const TYPE_STYLES: Record<string, string> = {
  carpool: 'bg-amber-50 text-amber-700',
  hotel: 'bg-blue-50 text-blue-700',
  flight: 'bg-purple-50 text-purple-700',
  buddy: 'bg-emerald-50 text-emerald-700',
}

const TYPE_LABELS: Record<string, string> = {
  carpool: '🚗 Carpool', hotel: '🏨 Hotel', flight: '✈️ Flight', buddy: '🧳 Buddy',
}

const JOIN_LABELS: Record<string, string> = {
  carpool: 'Join ride', hotel: 'Join stay', flight: 'Grab seat', buddy: 'Connect',
}

const TRIPS = [
  { id: '1', title: 'Delhi → Manali road trip', type: 'carpool', from: 'Delhi', to: 'Manali', date: 'Mar 28 · 3 days', seats: 2, totalSeats: 4, price: '₹1,800/person', desc: 'Leaving Friday night. Music allowed, no smoking. Shared fuel + toll.', vehicle: 'Innova Crysta' },
  { id: '2', title: 'Goa beach hotel — 3 nights', type: 'hotel', from: 'North Goa', to: 'Calangute', date: 'Apr 5–8', seats: 1, totalSeats: 3, price: '₹3,600/stay', desc: 'One room available. ₹1,200/night split.' },
  { id: '3', title: 'Mumbai → Bangkok flight share', type: 'flight', from: 'Mumbai', to: 'Bangkok', date: 'Apr 12', seats: 2, totalSeats: 2, price: '₹7,200/person', desc: 'Cheap tickets found. Coordinate taxi & hotel too!', vehicle: 'IndiGo 6E' },
  { id: '4', title: 'Solo → group Spiti valley', type: 'buddy', from: 'Delhi', to: 'Spiti Valley', date: 'May 10–18', seats: 3, totalSeats: 3, price: '~₹9,000/person', desc: 'Open to 2–3 more. Split hotel + cab. All genders welcome.' },
]

export default function TripsSection() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? TRIPS : TRIPS.filter(t => t.type === filter)

  return (
    <div>
      <Hero
        title="Share a trip. Split the cost."
        description="Find carpools, hotel rooms, flights, and travel buddies. Post your trip, let people join."
        stats={[
          { value: '1,200+', label: 'trips posted' },
          { value: '4.8k', label: 'travellers matched' },
          { value: 'avg ₹1,400', label: 'saved per trip' },
        ]}
        primaryBtn="Find a trip"
        secondaryBtn="Post my trip"
      />
      <FilterBar tags={TYPES} onChange={setFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(trip => (
          <div key={trip.id} className="card">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm font-medium text-gray-900 leading-snug">{trip.title}</h3>
              <span className={`badge shrink-0 ${TYPE_STYLES[trip.type]}`}>{TYPE_LABELS[trip.type]}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
              <span>{trip.from}</span><span className="text-gray-300">→</span><span>{trip.to}</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-3">
              <span className="text-xs text-gray-400"><strong className="text-gray-600">{trip.date}</strong></span>
              <span className="text-xs text-gray-400"><strong className="text-gray-600">{trip.seats}</strong> left</span>
              {trip.vehicle && <span className="text-xs text-gray-400">{trip.vehicle}</span>}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">{trip.desc}</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-900">{trip.price}</div>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: trip.totalSeats }).map((_, i) => (
                    <div key={i} className={i < trip.seats ? 'dot-filled' : 'dot-empty'} />
                  ))}
                </div>
              </div>
              <button className="btn-outline text-xs px-3 py-1.5">{JOIN_LABELS[trip.type]}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
