'use client'
import { useState } from 'react'
import Hero from '@/components/shared/Hero'
import FilterBar from '@/components/shared/FilterBar'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'streaming', label: '🎬 Streaming' },
  { value: 'ai', label: '🤖 AI Tools' },
  { value: 'design', label: '🎨 Design' },
  { value: 'hosting', label: '🌐 Hosting' },
  { value: 'vpn', label: '🔒 VPN' },
  { value: 'saas', label: '📦 SaaS' },
  { value: 'music', label: '🎵 Music' },
]

const SUBS = [
  { id: '1', icon: '🎬', bg: '#FFECEC', name: 'Netflix Premium', by: 'Arun K.', desc: '4K UHD, separate profile, no ads.', price: 149, slots: 2, total: 4, category: 'streaming', featured: false },
  { id: '2', icon: '🌐', bg: '#E6F1FB', name: 'Hostinger Business', by: 'Priya S.', desc: 'Subdomain + 10GB storage.', price: 89, slots: 2, total: 5, category: 'hosting', featured: true },
  { id: '3', icon: '🤖', bg: '#E1F5EE', name: 'ChatGPT Plus', by: 'Rahul M.', desc: 'GPT-4o full access. Shared team plan.', price: 299, slots: 1, total: 2, category: 'ai', featured: false },
  { id: '4', icon: '🎨', bg: '#FBEAF0', name: 'Figma Professional', by: 'Sofia T.', desc: 'Full editor, dev mode, unlimited projects.', price: 199, slots: 2, total: 4, category: 'design', featured: false },
  { id: '5', icon: '🔒', bg: '#FAEEDA', name: 'NordVPN 6-device', by: 'James R.', desc: 'One device slot. All regions, no logs.', price: 79, slots: 4, total: 6, category: 'vpn', featured: false },
  { id: '6', icon: '🎵', bg: '#E1F5EE', name: 'Spotify Duo', by: 'Karan P.', desc: 'Ad-free, offline mode, full library.', price: 99, slots: 1, total: 2, category: 'music', featured: false },
  { id: '7', icon: '📦', bg: '#F5F4EF', name: 'Notion Team', by: 'Meena J.', desc: 'Full workspace, unlimited blocks.', price: 129, slots: 3, total: 5, category: 'saas', featured: false },
]

export default function SubscriptionsSection() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? SUBS : SUBS.filter(s => s.category === filter)

  return (
    <div>
      <Hero
        title="Split subscriptions. Save money."
        description="Join shared plans for Netflix, Spotify, ChatGPT, Figma and more. Pay only your share."
        stats={[
          { value: '8,400+', label: 'active shares' },
          { value: '31k+', label: 'members saving' },
          { value: 'avg 68%', label: 'cost saved' },
        ]}
        primaryBtn="Find a plan"
        secondaryBtn="List my plan"
      />
      <FilterBar tags={CATEGORIES} onChange={setFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(sub => (
          <div key={sub.id} className="card flex flex-col">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: sub.bg }}>
                {sub.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{sub.name}</div>
                <div className="text-xs text-gray-400">by {sub.by}</div>
              </div>
              {sub.featured ? (
                <span className="badge bg-brand text-white shrink-0">Featured</span>
              ) : (
                <span className="badge badge-brand shrink-0">{sub.total - sub.slots} open</span>
              )}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{sub.desc}</p>
            <div className="flex items-end justify-between mt-auto">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  ₹{sub.price}<span className="text-xs font-normal text-gray-400">/mo</span>
                </div>
                <div className="flex gap-1 mt-1.5">
                  {Array.from({ length: sub.total }).map((_, i) => (
                    <div key={i} className={i < sub.slots ? 'dot-filled' : 'dot-empty'} />
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{sub.slots}/{sub.total} slots</div>
              </div>
              <button className="btn-outline text-xs px-3 py-1.5">Join</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
