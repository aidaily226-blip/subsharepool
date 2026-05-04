'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import SubscriptionsSection from './SubscriptionsSection'
import TripsSection from './TripsSection'
import LinksSection from './LinksSection'
import FeedSection from './FeedSection'

function Tabs() {
  const searchParams = useSearchParams()
  const active = searchParams.get('tab') || 'subs'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
      {active === 'subs' && <SubscriptionsSection />}
      {active === 'trips' && <TripsSection />}
      {active === 'links' && <LinksSection />}
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