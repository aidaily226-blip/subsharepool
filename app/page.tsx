import { Suspense } from 'react'
import HomeTabs from '@/components/sections/HomeTabs'
import Hero from '@/components/sections/Hero'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="text-center py-16 text-gray-400">Loading...</div>}>
        <HomeTabs />
      </Suspense>
    </>
  )
}
