import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Find a Reliable Travel Buddy for Your Next Trip in India',
  description: 'Learn how to find trustworthy travel companions for your next adventure across India and save on travel costs.',
}

export default function Post4() {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" className="text-sm text-brand hover:underline mb-6 inline-block">← Back to Blog</Link>
      <div className="mb-8">
        <span className="badge badge-brand text-xs mb-3 inline-block">Travel</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">
          How to Find a Reliable Travel Buddy for Your Next Trip in India
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>March 28, 2026</span><span>·</span><span>5 min read</span>
        </div>
      </div>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          Solo travel in India can be expensive and sometimes risky. Finding a reliable travel buddy not only cuts costs significantly but also makes the journey more enjoyable and safe.
        </p>
        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Benefits of Traveling With a Buddy</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>Split hotel room costs — save 50% on accommodation</li>
          <li>Share taxi and auto fares</li>
          <li>Better safety, especially for solo women travelers</li>
          <li>Someone to look after luggage while you explore</li>
          <li>More fun and shared memories</li>
        </ul>
        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Where to Find Travel Buddies</h2>
        <h3 className="font-semibold text-gray-900 mt-6 mb-2">SubSharePool Trip Sharing</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          Post your travel plans on SubSharePool's Trip Sharing section. Mention your destination, dates, budget and what you're looking for in a travel partner. Connect with like-minded travelers going to the same place.
        </p>
        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Safety Tips</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>Video call before meeting in person</li>
          <li>Share travel buddy's details with family</li>
          <li>Meet in public first before traveling together</li>
          <li>Keep separate finances initially</li>
          <li>Have a clear agreement on expenses upfront</li>
        </ul>
        <div className="bg-brand/5 border border-brand/20 rounded-xl p-5 mt-8">
          <p className="font-semibold text-gray-900 mb-2">Find your travel buddy today!</p>
          <p className="text-sm text-gray-600 mb-3">Post your trip on SubSharePool and connect with fellow travelers.</p>
          <Link href="/?tab=trips" className="btn-primary inline-block text-sm">Browse Trips</Link>
        </div>
      </div>
    </article>
  )
}
