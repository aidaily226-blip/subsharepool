import type { Metadata } from 'next'
import HomeTabs from '@/components/shared/HomeTabs'

export const metadata: Metadata = {
  title: 'SubSharePool — Share Subscriptions, Trips & More',
  description: 'Split subscription costs, share trips, discover creators and connect with your community. Save money by sharing with SubSharePool.',
}

export default function HomePage() {
  return (
    <div>
      <HomeTabs />
    </div>
  )
}
