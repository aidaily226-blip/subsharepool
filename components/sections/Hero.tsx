'use client'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STATS = [
  { value: '$200+', label: 'avg saved per year' },
  { value: '70+', label: 'members worldwide' },
  { value: '50-80%', label: 'average savings' },
  { value: 'Free', label: 'always, forever' },
]

const HOW_IT_WORKS = [
  {
    icon: '🔍',
    step: '1',
    title: 'Browse listings',
    desc: 'Find people already sharing Netflix, Spotify, ChatGPT and more — or post your own.',
  },
  {
    icon: '💬',
    step: '2',
    title: 'Message directly',
    desc: 'Chat with the person sharing. No middlemen, no platform fees, no surprises.',
  },
  {
    icon: '💰',
    step: '3',
    title: 'Split and save',
    desc: 'Agree on terms, split the cost, and start saving every single month.',
  },
]

const TESTIMONIALS = [
  {
    name: 'James R.',
    location: 'London, UK',
    text: 'Found a Netflix split in 15 minutes. Paying £4.50/month instead of £17.99. Genuinely can\'t believe I didn\'t do this sooner.',
    avatar: 'J',
    saving: 'Saves £160/yr',
  },
  {
    name: 'Sarah M.',
    location: 'New York, USA',
    text: 'Split Spotify, YouTube Premium and Microsoft 365 all through SubSharePool. My subscription bill went from $65 to $14 a month.',
    avatar: 'S',
    saving: 'Saves $612/yr',
  },
  {
    name: 'Alex K.',
    location: 'Toronto, Canada',
    text: 'Used the trip sharing section to find a carpool partner for my daily commute. Saving $280 a month on gas alone.',
    avatar: 'A',
    saving: 'Saves $3,360/yr',
  },
]

// Clean text-based service badges — professional look
const SERVICES = [
  { name: 'Netflix', bg: 'bg-black', text: 'text-red-500' },
  { name: 'Spotify', bg: 'bg-black', text: 'text-green-400' },
  { name: 'ChatGPT', bg: 'bg-[#10A37F]', text: 'text-white' },
  { name: 'YouTube', bg: 'bg-red-600', text: 'text-white' },
  { name: 'Amazon', bg: 'bg-[#232F3E]', text: 'text-[#FF9900]' },
  { name: 'Disney+', bg: 'bg-[#113CCF]', text: 'text-white' },
  { name: 'Microsoft', bg: 'bg-[#0078D4]', text: 'text-white' },
  { name: 'Claude', bg: 'bg-[#CC785C]', text: 'text-white' },
]

export default function Hero() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className="bg-cream">
      {/* Main Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="text-center max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            The average member saves $200+ per year
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
            Save money by sharing
            <span className="text-brand block">subscriptions & trips</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-xl mx-auto">
            Split Netflix, Spotify, ChatGPT and more with trusted people. Find carpool partners. Share links. Connect with your community. All in one place — completely free.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            {session ? (
              <>
                <button onClick={() => router.push('/dashboard')} className="btn-primary px-8 py-3 text-base">
                  Go to Dashboard
                </button>
                <button onClick={() => router.push('/?tab=subs')} className="btn-outline px-8 py-3 text-base">
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

          {/* Service badges — professional pill style */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
            {SERVICES.map(service => (
              <span
                key={service.name}
                className={`${service.bg} ${service.text} text-xs font-semibold px-3 py-1.5 rounded-full`}
              >
                {service.name}
              </span>
            ))}
            <span className="bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full">
              +20 more
            </span>
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
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Savings table */}
      <div className="bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Real savings, real numbers</h2>
            <p className="text-gray-400 text-sm">What you pay vs what you could pay</p>
          </div>
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-100 px-4 py-3 text-xs font-medium text-gray-500">
              <span>Service</span>
              <span className="text-center">Solo price</span>
              <span className="text-center">Split price</span>
              <span className="text-center text-green-600">You save</span>
            </div>
            {[
              { service: 'Netflix Premium', solo: '$22.99', split: '$5.75', saving: '75%' },
              { service: 'Spotify Family', solo: '$16.99', split: '$2.83', saving: '83%' },
              { service: 'YouTube Premium', solo: '$13.99', split: '$2.80', saving: '80%' },
              { service: 'Microsoft 365', solo: '$9.99', split: '$1.67', saving: '83%' },
              { service: 'ChatGPT Plus', solo: '$20.00', split: '$5.00', saving: '75%' },
              { service: 'Amazon Prime', solo: '$14.99', split: '$3.75', saving: '75%' },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-4 px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <span className="font-medium text-gray-900">{row.service}</span>
                <span className="text-center text-gray-400 line-through">{row.solo}</span>
                <span className="text-center font-semibold text-gray-900">{row.split}</span>
                <span className="text-center font-bold text-green-600">{row.saving}</span>
              </div>
            ))}
            <div className="grid grid-cols-4 px-4 py-3 bg-brand/5 border-t border-brand/10">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-center text-gray-400 line-through font-medium">$98.95</span>
              <span className="text-center font-bold text-brand">$21.80</span>
              <span className="text-center font-bold text-green-600">78%</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">*Based on 4-6 way splits. Prices are indicative.</p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What members say</h2>
          <p className="text-gray-400 text-sm">Real people saving real money</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {t.saving}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">"{t.text}"</p>
              <div className="flex gap-0.5 mt-3">
                {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-sm">★</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      {!session && (
        <div className="bg-gray-900 text-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Ready to stop overpaying?
            </h2>
            <p className="text-gray-400 mb-8 text-sm max-w-md mx-auto">
              Join 70+ members worldwide already splitting subscriptions and saving hundreds every year. Takes less than 30 seconds.
            </p>
            <button
              onClick={() => signIn('google')}
              className="bg-white text-gray-900 font-semibold px-10 py-3 rounded-full text-base hover:bg-gray-100 transition-colors"
            >
              Join Free — No Credit Card Needed
            </button>
            <p className="text-gray-500 text-xs mt-4">No spam · Cancel anytime · Free forever</p>
          </div>
        </div>
      )}

      <div id="listings" />
    </div>
  )
}
