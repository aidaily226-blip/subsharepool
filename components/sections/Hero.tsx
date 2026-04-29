'use client'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const LOGOS = [
  { name: 'Netflix', color: '#E50914', letter: 'N' },
  { name: 'Spotify', color: '#1DB954', letter: 'S' },
  { name: 'ChatGPT', color: '#10A37F', letter: 'G' },
  { name: 'YouTube', color: '#FF0000', letter: 'Y' },
  { name: 'Amazon', color: '#FF9900', letter: 'A' },
  { name: 'Disney+', color: '#113CCF', letter: 'D' },
]

const STATS = [
  { value: '70+', label: 'Members worldwide' },
  { value: '10+', label: 'Active listings' },
  { value: '50-80%', label: 'Average savings' },
  { value: '100%', label: 'Free to join' },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Browse listings', desc: 'Find subscriptions, trips and links shared by members worldwide.', icon: '🔍' },
  { step: '2', title: 'Message the owner', desc: 'Chat directly with the person sharing. No middlemen, no fees.', icon: '💬' },
  { step: '3', title: 'Split & save', desc: 'Agree on terms, split the cost, and start saving immediately.', icon: '💰' },
]

const TESTIMONIALS = [
  { name: 'Rahul M.', location: 'Mumbai', text: 'Found a Netflix split partner in 10 minutes. Saving ₹486 every month!', avatar: 'R' },
  { name: 'Sarah K.', location: 'London', text: 'Split my Spotify family plan with 5 others. Now paying just £3/month!', avatar: 'S' },
  { name: 'Arjun P.', location: 'Delhi', text: 'Found carpool partners for my daily commute. Saving ₹3,000/month on fuel.', avatar: 'A' },
]

export default function Hero() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className="bg-cream">
      {/* Main Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
            70+ members saving money worldwide
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Save money by sharing
            <span className="text-brand block">subscriptions & trips</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-xl mx-auto">
            Split Netflix, Spotify, ChatGPT and more with trusted people. Find carpool partners. Share links. Connect with your community. All in one place — completely free.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            {session ? (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn-primary px-8 py-3 text-base"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push('/?tab=subs')}
                  className="btn-outline px-8 py-3 text-base"
                >
                  Browse Listings
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => signIn('google')}
                  className="btn-primary px-8 py-3 text-base flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Join Free with Google
                </button>
                <button
                  onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-outline px-8 py-3 text-base"
                >
                  Browse Listings
                </button>
              </>
            )}
          </div>

          {/* Trust signals */}
          <p className="text-xs text-gray-400 mb-12">
            ✅ No credit card required &nbsp;·&nbsp; ✅ Free forever &nbsp;·&nbsp; ✅ Sign in with Google
          </p>

          {/* Subscription logos */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
            {LOGOS.map(logo => (
              <div
                key={logo.name}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                style={{ backgroundColor: logo.color }}
                title={logo.name}
              >
                {logo.letter}
              </div>
            ))}
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-medium">
              +20
            </div>
          </div>
          <p className="text-xs text-gray-400">Split any subscription with trusted members</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-y border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map(stat => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-brand mb-1">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How it works</h2>
          <p className="text-gray-400 text-sm">Start saving in 3 simple steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map(item => (
            <div key={item.step} className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:border-brand/30 transition-colors">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                {item.icon}
              </div>
              <div className="w-6 h-6 bg-brand text-white text-xs font-bold rounded-full flex items-center justify-center mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What members say</h2>
            <p className="text-gray-400 text-sm">Real people saving real money</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-brand text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">"{t.text}"</p>
                <div className="flex gap-0.5 mt-3">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-sm">★</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      {!session && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to start saving?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Join 70+ members worldwide who are already splitting costs and saving money every month.
          </p>
          <button
            onClick={() => signIn('google')}
            className="btn-primary px-10 py-3 text-base"
          >
            Join Free — No Credit Card Needed
          </button>
          <p className="text-xs text-gray-400 mt-4">Takes less than 30 seconds to sign up</p>
        </div>
      )}

      {/* Listings anchor */}
      <div id="listings" />
    </div>
  )
}
