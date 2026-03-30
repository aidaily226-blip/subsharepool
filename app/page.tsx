import { Suspense } from 'react'
import HomeTabs from '@/components/sections/HomeTabs'

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading...</div>}>
      <HomeTabs />
    </Suspense>
  )
}
