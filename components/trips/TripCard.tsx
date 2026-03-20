import { Trip } from '@/lib/types'
import { TRIP_TYPE_STYLES } from '@/lib/constants'

const TYPE_LABELS: Record<string, string> = {
  carpool: '🚗 Carpool',
  hotel: '🏨 Hotel',
  flight: '✈️ Flight',
  buddy: '🧳 Travel Buddy',
}

const JOIN_LABELS: Record<string, string> = {
  carpool: 'Join ride',
  hotel: 'Join stay',
  flight: 'Grab seat',
  buddy: 'Connect',
}

export default function TripCard({ trip }: { trip: Trip }) {
  const openSeats = trip.total_seats - trip.filled_seats

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-medium text-gray-900 leading-snug">{trip.title}</h3>
        <span className={`badge shrink-0 ${TRIP_TYPE_STYLES[trip.type]}`}>
          {TYPE_LABELS[trip.type]}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
        <span>{trip.from_location}</span>
        <span className="text-gray-300">→</span>
        <span>{trip.to_location}</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-3">
        <span className="text-xs text-gray-400"><strong className="text-gray-600">{trip.date}</strong></span>
        <span className="text-xs text-gray-400"><strong className="text-gray-600">{openSeats}</strong> seats left</span>
        {trip.vehicle && <span className="text-xs text-gray-400">{trip.vehicle}</span>}
      </div>

      <p className="text-xs text-gray-500 leading-relaxed mb-3">{trip.description}</p>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900">{trip.price}</div>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: trip.total_seats }).map((_, i) => (
              <div key={i} className={i < trip.filled_seats ? 'dot-filled' : 'dot-empty'} />
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{trip.filled_seats}/{trip.total_seats} filled</div>
        </div>
        <button className="btn-outline text-xs px-3 py-1.5">{JOIN_LABELS[trip.type]}</button>
      </div>
    </div>
  )
}
