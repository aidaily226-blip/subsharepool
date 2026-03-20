import { Subscription } from '@/lib/types'

interface SubCardProps {
  sub: Subscription
}

export default function SubCard({ sub }: SubCardProps) {
  const openSlots = sub.total_slots - sub.filled_slots

  return (
    <div className="card flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: sub.icon_bg }}
        >
          {sub.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{sub.name}</div>
          <div className="text-xs text-gray-400">by {sub.user?.name || 'Anonymous'}</div>
        </div>
        {sub.featured ? (
          <span className="badge badge-featured shrink-0">Featured</span>
        ) : (
          <span className="badge badge-brand shrink-0">{openSlots} open</span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{sub.description}</p>

      {/* Footer */}
      <div className="flex items-end justify-between mt-auto">
        <div>
          {sub.price ? (
            <div className="text-sm font-semibold text-gray-900">
              ₹{sub.price}<span className="text-xs font-normal text-gray-400">/mo</span>
            </div>
          ) : (
            <div className="text-sm font-semibold text-emerald-600">Free</div>
          )}
          <div className="flex gap-1 mt-1.5">
            {Array.from({ length: sub.total_slots }).map((_, i) => (
              <div key={i} className={i < sub.filled_slots ? 'dot-filled' : 'dot-empty'} />
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {sub.filled_slots}/{sub.total_slots} slots
          </div>
        </div>
        <button className="btn-outline text-xs px-3 py-1.5">
          {sub.price ? 'Join' : 'Chat'}
        </button>
      </div>
    </div>
  )
}
