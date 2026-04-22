import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '10 Best Subscriptions to Share With Friends in 2026',
  description: 'From streaming to productivity tools, these are the top subscriptions worth splitting to save up to ₹500 per month.',
}

export default function Post3() {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" className="text-sm text-brand hover:underline mb-6 inline-block">← Back to Blog</Link>

      <div className="mb-8">
        <span className="badge badge-brand text-xs mb-3 inline-block">Subscriptions</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">
          10 Best Subscriptions to Share With Friends in 2026
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>April 5, 2026</span>
          <span>·</span>
          <span>6 min read</span>
        </div>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          Subscription costs are adding up fast. The average Indian user now spends ₹2,000-3,000 per month on various subscriptions. But most of these services allow multiple users — meaning you can split costs and save significantly.
        </p>

        {[
          { name: 'Netflix', icon: '📺', price: '₹649/month', split: '₹163/person (4 users)', saving: '75%', note: 'Premium plan supports 4K and 4 simultaneous streams.' },
          { name: 'Spotify', icon: '🎵', price: '₹179/month', split: '₹30/person (6 users)', saving: '83%', note: 'Family plan includes 6 accounts with separate libraries.' },
          { name: 'ChatGPT Plus', icon: '🤖', price: '₹1,700/month', split: '₹425/person (4 users)', saving: '75%', note: 'Share API credits or use family accounts where available.' },
          { name: 'Amazon Prime', icon: '📦', price: '₹1,499/year', split: '₹375/person (4 users)', saving: '75%', note: 'Includes Prime Video, free delivery and Prime Music.' },
          { name: 'YouTube Premium', icon: '▶️', price: '₹189/month', split: '₹32/person (6 users)', saving: '83%', note: 'Family plan with ad-free viewing and background play.' },
          { name: 'Adobe Creative Cloud', icon: '🎨', price: '₹4,230/month', split: '₹1,058/person (4 users)', saving: '75%', note: 'Perfect for designers and creative professionals.' },
          { name: 'Microsoft 365', icon: '💼', price: '₹5,299/year', split: '₹884/person (6 users)', saving: '83%', note: 'Family plan includes Word, Excel, PowerPoint and 1TB OneDrive each.' },
          { name: 'Hotstar', icon: '🏏', price: '₹899/year', split: '₹225/person (4 users)', saving: '75%', note: 'Essential for IPL, live sports and Disney+ content.' },
          { name: 'Duolingo Plus', icon: '🦉', price: '₹667/month', split: '₹167/person (4 users)', saving: '75%', note: 'Ad-free language learning with offline access.' },
          { name: 'Notion AI', icon: '📝', price: '₹1,360/month', split: '₹340/person (4 users)', saving: '75%', note: 'AI-powered workspace for teams and individuals.' },
        ].map((sub, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{sub.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900">{i + 1}. {sub.name}</h3>
                  <p className="text-xs text-gray-400">Save up to {sub.saving}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{sub.price}</p>
                <p className="text-xs text-green-600 font-medium">{sub.split}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">{sub.note}</p>
          </div>
        ))}

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How to Find Sharing Partners</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          SubSharePool makes it easy to find trusted people to split subscriptions with. Simply browse the Subscriptions section, find a plan that works for you, and message the owner to join. Or post your own subscription share and let others join you.
        </p>

        <div className="bg-brand/5 border border-brand/20 rounded-xl p-5 mt-8">
          <p className="font-semibold text-gray-900 mb-2">Start saving on subscriptions today!</p>
          <p className="text-sm text-gray-600 mb-3">Join SubSharePool and find trusted people to split subscription costs with.</p>
          <Link href="/?tab=subs" className="btn-primary inline-block text-sm">Browse Subscription Shares</Link>
        </div>
      </div>
    </article>
  )
}
