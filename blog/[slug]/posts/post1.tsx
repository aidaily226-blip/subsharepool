import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Split Netflix With Friends and Save 60% Every Month',
  description: 'Netflix sharing is one of the easiest ways to cut your monthly bills. Here\'s a step-by-step guide to safely split your subscription.',
}

export default function Post1() {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" className="text-sm text-brand hover:underline mb-6 inline-block">← Back to Blog</Link>

      <div className="mb-8">
        <span className="badge badge-brand text-xs mb-3 inline-block">Subscriptions</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">
          How to Split Netflix With Friends and Save 60% Every Month
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>April 15, 2026</span>
          <span>·</span>
          <span>5 min read</span>
        </div>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          With Netflix India plans ranging from ₹149 to ₹649 per month, many users are looking for ways to cut costs. The good news? Splitting your Netflix subscription with trusted friends or family is completely possible and can save you up to 60% every month.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Why Split Netflix?</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          The Netflix Premium plan at ₹649/month allows up to 4 simultaneous streams. If you split this with 3 other people, each person pays just ₹163/month — a massive saving compared to the individual Mobile plan at ₹149.
        </p>

        <div className="bg-gray-50 rounded-xl p-5 my-6">
          <h3 className="font-bold text-gray-900 mb-3">Cost Breakdown</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Premium Plan (4 screens)</span><span className="font-medium">₹649/month</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Per person (4 people)</span><span className="font-medium text-green-600">₹163/month</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Annual saving per person</span><span className="font-medium text-green-600">₹5,832/year</span></div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Step-by-Step Guide to Splitting Netflix</h2>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">1. Find Trusted People</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          The most important step is finding people you trust. Use SubSharePool to post your Netflix share listing and connect with verified users in your area or community. Always prefer people you know personally or who have good ratings on the platform.
        </p>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">2. Set Up Payment</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          Agree on a payment schedule upfront. Monthly payments via UPI are the most convenient. Use apps like GPay, PhonePe or Paytm for easy transfers. One person pays the Netflix bill and collects from others.
        </p>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">3. Create Separate Profiles</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          Netflix allows up to 5 profiles per account. Each person should create their own profile to keep watch history and recommendations separate. Set a PIN on your profile for privacy.
        </p>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">4. Set Clear Rules</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          Agree on rules before starting — payment deadlines, what happens if someone wants to leave, and how to handle password changes. Clear communication prevents misunderstandings.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Tips for Safe Subscription Sharing</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>Never share your Netflix password via text or email — use the app's built-in sharing feature</li>
          <li>Use a dedicated email for your Netflix account, not your primary email</li>
          <li>Collect payments before renewing the subscription</li>
          <li>Have a backup plan if a member stops paying</li>
          <li>Review your account activity regularly for any unauthorized access</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Start Saving Today</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          Splitting subscriptions is one of the smartest ways to reduce your monthly expenses. With SubSharePool, finding trusted subscription partners is easy and safe. Post your listing today and start saving!
        </p>

        <div className="bg-brand/5 border border-brand/20 rounded-xl p-5 mt-8">
          <p className="font-semibold text-gray-900 mb-2">Ready to split your Netflix subscription?</p>
          <p className="text-sm text-gray-600 mb-3">Join thousands of users on SubSharePool who are already saving money by sharing subscriptions.</p>
          <Link href="/?tab=subs" className="btn-primary inline-block text-sm">Browse Subscription Shares</Link>
        </div>
      </div>
    </article>
  )
}
