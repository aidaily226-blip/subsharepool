'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SubscriptionsSection from './SubscriptionsSection'
import RequestsSection from './RequestsSection'
import TripsSection from './TripsSection'
import LinksSection from './LinksSection'
import CreatorsSection from './CreatorsSection'
import FeedSection from './FeedSection'

function Tabs() {
  const searchParams = useSearchParams()
  const active = searchParams.get('tab') || 'subs'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
      {active === 'subs' && <SubscriptionsSection />}
      {active === 'requests' && <RequestsSection />}
      {active === 'trips' && <TripsSection />}
      {active === 'links' && <LinksSection />}
      {active === 'creators' && <CreatorsSection />}
      {active === 'feed' && <FeedSection />}
    </div>
  )
}

export default function HomeTabs() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400">Loading...</div>}>
      <Tabs />
    </Suspense>
  )
}
