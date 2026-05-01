'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'

interface Listing {
  id: string
  name?: string
  title?: string
  price?: number | string
  currency?: string
  category?: string
  type?: string
  users?: { name: string }
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'AED ', SGD: 'SGD ', AUD: 'A$',
}

export default function BlogCTA({ type = 'subs' }: { type?: 'subs' | 'trips' }) {
  const { data: session } = useSession()
  const [listings, setListings] = useState<Listing[]>([])
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch(`/api/${type === 'subs' ? 'subscriptions' : 'trips'}?page=1`)
      .then(r => r.json())
      .then(d => setListings((d.data || []).slice(0, 3)))
      .catch(() => {})
  }, [type])

  const handleEmailSubmit = () => {
    if (!email) return
    setSubmitted(true)
  }

  return (
    <div className="mt-12 space-y-6">
      {/* Live listings */}
      {listings.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">
                {type === 'subs' ? '📦 Active sharing listings right now' : '✈️ Active trip listings right now'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Real people looking to split costs</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            {listings.map(listing => (
              <div key={listing.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{listing.name || listing.title}</p>
                  <p className="text-xs text-gray-400">{listing.users?.name} · {listing.category || listing.type}</p>
                </div>
                <div className="text-right">
                  {listing.price && (
                    <p className="text-sm font-bold text-brand">
                      {CURRENCY_SYMBOLS[listing.currency || 'USD'] || '$'}{listing.price}
                      <span className="text-xs text-gray-400">/mo</span>
                    </p>
                  )}
                  <button
                    onClick={() => session ? window.location.href = `/?tab=${type}` : signIn('google')}
                    className="text-xs text-brand hover:underline mt-0.5"
                  >
                    {session ? 'View →' : 'Sign in to join →'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={`/?tab=${type}`}
            className="btn-primary w-full text-center block text-sm py-2.5"
          >
            See all listings — Join free
          </Link>
        </div>
      )}

      {/* Sign up CTA */}
      {!session && (
        <div className="bg-brand rounded-2xl p-6 text-center">
          <p className="text-white font-bold text-lg mb-2">
            Ready to start saving?
          </p>
          <p className="text-white/80 text-sm mb-5">
            Join 70+ members worldwide already splitting costs on SubSharePool. Takes less than 30 seconds.
          </p>
          <button
            onClick={() => signIn('google')}
            className="bg-white text-brand font-semibold px-8 py-3 rounded-full text-sm hover:bg-gray-50 transition-colors w-full sm:w-auto flex items-center justify-center gap-2 mx-auto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google — It's Free
          </button>
          <p className="text-white/60 text-xs mt-3">No credit card · No spam · Cancel anytime</p>
        </div>
      )}

      {/* Email capture for hesitant users */}
      {!session && !submitted && (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
          <p className="text-sm font-medium text-gray-900 mb-1">Not ready to sign up yet?</p>
          <p className="text-xs text-gray-400 mb-3">Get notified when new listings matching your interests are posted.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input flex-1 text-sm"
            />
            <button
              onClick={handleEmailSubmit}
              className="btn-primary text-sm px-4 shrink-0"
            >
              Notify me
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
          <p className="text-green-700 font-medium text-sm">✅ You're on the list!</p>
          <p className="text-green-600 text-xs mt-1">We'll notify you when relevant listings are posted.</p>
        </div>
      )}

      {/* Social proof */}
      <div className="flex flex-wrap gap-4 text-center justify-center py-2">
        {[
          { value: '70+', label: 'Members' },
          { value: '100%', label: 'Free' },
          { value: '50-80%', label: 'Avg Savings' },
          { value: '0', label: 'Fees' },
        ].map(s => (
          <div key={s.label}>
            <p className="text-lg font-bold text-brand">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
