import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Ultimate Guide to Carpooling in India: Save Money on Every Trip',
  description: 'Carpooling is booming in India. Learn how to find reliable travel partners, split fuel costs, and make your commute cheaper.',
}

export default function Post2() {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" className="text-sm text-brand hover:underline mb-6 inline-block">← Back to Blog</Link>

      <div className="mb-8">
        <span className="badge badge-brand text-xs mb-3 inline-block">Trip Sharing</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">
          The Ultimate Guide to Carpooling in India: Save Money on Every Trip
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>April 10, 2026</span>
          <span>·</span>
          <span>7 min read</span>
        </div>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          With fuel prices at an all-time high and traffic getting worse in Indian cities, carpooling has become one of the smartest ways to commute. Whether it's a daily office commute or a weekend road trip, sharing rides can cut your travel costs by 50-75%.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Why Carpooling Makes Sense in India</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          India has over 300 million registered vehicles and fuel costs have increased significantly. A typical commuter in Mumbai or Delhi spends ₹3,000-5,000 per month on fuel alone. Carpooling with just one other person cuts that in half immediately.
        </p>

        <div className="bg-gray-50 rounded-xl p-5 my-6">
          <h3 className="font-bold text-gray-900 mb-3">Monthly Savings Example</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Solo commute cost</span><span className="font-medium">₹4,000/month</span></div>
            <div className="flex justify-between"><span className="text-gray-600">With 1 partner</span><span className="font-medium text-green-600">₹2,000/month</span></div>
            <div className="flex justify-between"><span className="text-gray-600">With 3 partners</span><span className="font-medium text-green-600">₹1,000/month</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Annual saving (3 partners)</span><span className="font-medium text-green-600">₹36,000/year</span></div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How to Find Carpooling Partners</h2>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">1. Use SubSharePool</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          Post your route, timing and vehicle details on SubSharePool's Trip Sharing section. Other users heading the same way can connect with you directly. This is the fastest way to find regular carpool partners.
        </p>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">2. Check Your Office or College Network</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          Many companies have internal carpooling groups on WhatsApp or Slack. Check if your workplace has one, or start one yourself. Carpooling with colleagues is safer since you already know them.
        </p>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">3. Apartment Community Groups</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          If you live in a large apartment complex, there's a good chance other residents commute to similar areas. Post in your building's WhatsApp group and you might find carpool partners within minutes.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Safety Tips for Carpooling</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>Always verify the identity of your carpool partner before the first ride</li>
          <li>Share your ride details with a family member or friend</li>
          <li>Meet for the first time in a public place</li>
          <li>Keep emergency contacts saved and accessible</li>
          <li>Trust your instincts — if something feels wrong, cancel the ride</li>
          <li>Use UPI for payments to maintain a transaction record</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Carpooling Etiquette in India</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Good carpooling relationships depend on mutual respect. Always be on time — keeping others waiting is the biggest complaint in carpool groups. Agree on music preferences, AC settings, and whether conversations are welcome during the ride.
        </p>

        <div className="bg-brand/5 border border-brand/20 rounded-xl p-5 mt-8">
          <p className="font-semibold text-gray-900 mb-2">Find your carpool partner today!</p>
          <p className="text-sm text-gray-600 mb-3">Post your trip on SubSharePool and connect with people heading your way.</p>
          <Link href="/?tab=trips" className="btn-primary inline-block text-sm">Browse Trip Shares</Link>
        </div>
      </div>
    </article>
  )
}
