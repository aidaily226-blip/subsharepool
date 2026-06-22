'use client'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function JoinPage() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            16+ members already saving money
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              Sub<span className="text-brand">Share</span>Pool
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Save money.<br />
            <span className="text-brand">Earn from referrals.</span>
          </h1>

          <p className="text-gray-500 mb-8 leading-relaxed">
            Split Netflix, Spotify, ChatGPT with trusted people.
            Refer friends and earn ₹2 per referral via UPI.
            Completely free to join.
          </p>

          {/* Earn boxes */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-brand mb-1">₹1</p>
              <p className="text-xs text-gray-500">when friend signs up<br />with your link</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-brand mb-1">₹1</p>
              <p className="text-xs text-gray-500">when you post your<br />first listing</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600 mb-1">75%</p>
              <p className="text-xs text-gray-500">avg savings on<br />subscriptions</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-1">UPI</p>
              <p className="text-xs text-gray-500">direct payment<br />India only</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => signIn('google')}
            className="w-full bg-brand text-white font-semibold py-4 rounded-2xl text-base hover:bg-brand-dark transition-colors flex items-center justify-center gap-3 mb-4"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Join Free with Google
          </button>

          <p className="text-xs text-gray-400 mb-8">
            No credit card · No spam · Takes 30 seconds
          </p>

          {/* What you can do */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-left mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-3">What you can do on SubSharePool:</p>
            <div className="space-y-2">
              {[
                { icon: '📦', text: 'Split Netflix, Spotify, ChatGPT — pay 75% less' },
                { icon: '✈️', text: 'Find carpool partners for daily commute' },
                { icon: '🔗', text: 'Share affiliate links and referral links' },
                { icon: '💰', text: 'Earn ₹2 per referral via UPI payment' },
                { icon: '💬', text: 'Connect with community — post ideas and deals' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <p className="text-sm text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Savings proof */}
          <div className="bg-brand/5 border border-brand/20 rounded-2xl p-4 mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-3">Real savings with splitting:</p>
            <div className="space-y-2">
              {[
                { service: 'Netflix Premium', solo: '$22.99', split: '$5.75' },
                { service: 'Spotify Family', solo: '$16.99', split: '$2.83' },
                { service: 'ChatGPT Plus', solo: '$20.00', split: '$5.00' },
                { service: 'YouTube Premium', solo: '$13.99', split: '$2.80' },
              ].map(row => (
                <div key={row.service} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{row.service}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-xs">{row.solo}</span>
                    <span className="font-bold text-brand">{row.split}/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {[
              '✅ 100% Free',
              '✅ No fees',
              '✅ UPI payments',
              '✅ India only referrals',
              '✅ Direct messaging',
            ].map(item => (
              <span key={item} className="text-xs text-gray-500 bg-white border border-gray-100 px-3 py-1.5 rounded-full">
                {item}
              </span>
            ))}
          </div>

          {/* Bottom CTA */}
          <button
            onClick={() => signIn('google')}
            className="w-full bg-gray-900 text-white font-semibold py-4 rounded-2xl text-base hover:bg-gray-800 transition-colors mb-4"
          >
            Get Started — It's Free
          </button>

          <p className="text-xs text-gray-400">
            Already have an account?{' '}
            <button onClick={() => signIn('google')} className="text-brand hover:underline">
              Sign in
            </button>
          </p>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-4 text-center">
        <p className="text-xs text-gray-400">
          © 2026 SubSharePool ·{' '}
          <Link href="/privacy" className="hover:text-brand">Privacy</Link>
          {' · '}
          <Link href="/terms" className="hover:text-brand">Terms</Link>
          {' · '}
          <Link href="/" className="hover:text-brand">Browse listings</Link>
        </p>
      </div>

    </div>
  )
}
