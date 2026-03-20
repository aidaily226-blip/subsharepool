'use client'
import { useState } from 'react'
import Hero from '@/components/shared/Hero'
import FilterBar from '@/components/shared/FilterBar'
import TripCard from './TripCard'
import { TRIP_TYPES } from '@/lib/constants'
import { Trip } from '@/lib/types'

const MOCK_TRIPS: Trip[] = [
  { id:'1', user_id:'u1', title:'Delhi → Manali road trip', type:'carpool', from_location:'Delhi', to_location:'Manali', date:'Mar 28 · 3 days', total_seats:4, filled_seats:2, price:'₹1,800/person', description:'Leaving Friday night from Majnu Ka Tila. Music allowed, no smoking. Shared fuel + toll costs.', vehicle:'Innova Crysta', created_at:'' },
  { id:'2', user_id:'u2', title:'Goa beach hotel — 3 nights', type:'hotel', from_location:'North Goa', to_location:'Calangute', date:'Apr 5–8', total_seats:3, filled_seats:2, price:'₹3,600/stay', description:'Booked Airbnb with 3 rooms. One room available for a solo traveller or couple. ₹1,200/night split.', created_at:'' },
  { id:'3', user_id:'u3', title:'Mumbai → Bangkok flight share', type:'flight', from_location:'Mumbai', to_location:'Bangkok', date:'Apr 12', total_seats:2, filled_seats:0, price:'₹7,200/person', description:'Found cheap tickets at ₹7,200 roundtrip. 2 extras available — coordinate taxi & hotel too!', vehicle:'IndiGo 6E', created_at:'' },
  { id:'4', user_id:'u4', title:'Solo → group Spiti valley', type:'buddy', from_location:'Delhi', to_location:'Spiti Valley', date:'May 10–18 · 9 days', total_seats:3, filled_seats:0, price:'~₹9,000/person', description:'Planning a solo trip to Spiti, open to 2–3 more. Split hotel + cab costs. All genders welcome.', created_at:'' },
]

export default function TripsSection() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? MOCK_TRIPS : MOCK_TRIPS.filter(t => t.type === filter)

  return (
    <div>
      <Hero
        title="Share a trip. Split the cost."
        description="Find carpools, hotel rooms, flights, and travel buddies. Post your trip, let people join, and split everything fairly."
        stats={[
          { value: '1,200+', label: 'trips posted' },
          { value: '4.8k', label: 'travellers matched' },
          { value: 'avg ₹1,400', label: 'saved per trip' },
        ]}
        primaryBtn="Find a trip"
        secondaryBtn="Post my trip"
      />
      <FilterBar tags={TRIP_TYPES} onChange={setFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(trip => <TripCard key={trip.id} trip={trip} />)}
      </div>
    </div>
  )
}
