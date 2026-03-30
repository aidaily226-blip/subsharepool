'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SubscriptionsSection from './SubscriptionsSection'
import TripsSection from './TripsSection'
import LinksSection from './LinksSection'
import FeedSection from './FeedSection'

const TABS = [
  { id: 'subs', label: '📦 Subscriptions' },
  { id: 'trips', label: '✈️ Trip Sharing' },
  { id: 'links', label: '🔗 Social & Links' },
  { id: 'feed', label: '💬 Community Feed' },
]

export default function HomeTabs() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [active, setActive] = useState(searchParams.get('tab') || 'subs')

  const handleTab = (id: string) => {
    setActive(id)
    router.push(`/?tab=${id}`, { scroll: false })
  }

  return (
    <div>
      <div className="flex border-b border-gray-200 bg-cream sticky top-14 z-10 overflow-x-auto">
        <div className="flex gap-1 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className={`px-3 sm:px-4 py-3 text-xs sm:text-sm whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                active === tab.id
                  ? 'text-brand border-brand font-medium'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        {active === 'subs' && <SubscriptionsSection />}
        {active === 'trips' && <TripsSection />}
        {active === 'links' && <LinksSection />}
        {active === 'feed' && <FeedSection />}
      </div>
    </div>
  )
}
