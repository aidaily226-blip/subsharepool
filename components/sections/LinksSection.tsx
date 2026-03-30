'use client'
import { useState } from 'react'

const LINK_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'youtube', label: '🎥 YouTube' },
  { value: 'instagram', label: '📸 Instagram' },
  { value: 'portfolio', label: '💼 Portfolio' },
  { value: 'collab', label: '🤝 Collab' },
  { value: 'referral', label: '🔗 Referral' },
  { value: 'affiliate', label: '💰 Affiliate' },
]

const TYPE_STYLES: Record<string, string> = {
  youtube: 'bg-red-50 text-red-700',
  instagram: 'bg-pink-50 text-pink-700',
  portfolio: 'bg-purple-50 text-purple-700',
  referral: 'bg-amber-50 text-amber-700',
  collab: 'bg-emerald-50 text-emerald-700',
  affiliate: 'bg-green-50 text-green-700',
}

const TYPE_LABELS: Record<string, string> = {
  youtube: '🎥 YouTube',
  instagram: '📸 Instagram',
  portfolio: '💼 Portfolio',
  referral: '🔗 Referral',
  collab: '🤝 Collab',
  affiliate: '💰 Affiliate',
}

const BTN_LABELS: Record<string, string> = {
  youtube: 'Visit',
  instagram: 'Visit',
  portfolio: 'Visit',
  referral: 'Get link',
  collab: 'Connect',
  affiliate: 'See deals',
}

const MOCK_LINKS = [
  { id: '1', name: 'Aryan Kapoor', handle: '@aryantech', type: 'youtube', desc: 'Tech reviews & budget phones. 84k subscribers. Open for collab.', stat: '84k subs · 2.1M views' },
  { id: '2', name: 'Sanya Mehta', handle: '@sanyacreates', type: 'instagram', desc: 'Lifestyle & travel content. 41k followers. Looking for shoutout exchanges.', stat: '41k followers' },
  { id: '3', name: 'Rohan Verma', handle: 'rohanverma.dev', type: 'portfolio', desc: 'Full-stack dev. Built 12+ products. Open to freelance & collabs.', stat: '12 projects · open to work' },
  { id: '4', name: 'Tanvi Nair', handle: '@tanvifin', type: 'referral', desc: 'Zerodha referral — get ₹300 cashback when you open a demat account.', stat: '₹300 cashback for you' },
  { id: '5', name: 'Dev Studio', handle: 'devstudio.in', type: 'collab', desc: 'Design agency looking for freelance developers. React + Figma projects.', stat: '3 open roles' },
  { id: '6', name: 'Priya M.', handle: 'affiliate links', type: 'affiliate', desc: 'Hostinger 80% off, Notion Plus free trial, Canva Pro — curated deals.', stat: '3 active deals' },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_BG: Record<string, string> = {
  youtube: 'bg-red-100 text-red-700',
  instagram: 'bg-pink-100 text-pink-700',
  portfolio: 'bg-purple-100 text-purple-700',
  referral: 'bg-amber-100 text-amber-700',
  collab: 'bg-emerald-100 text-emerald-700',
  affiliate: 'bg-green-100 text-green-700',
}

export default function LinksSection() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? MOCK_LINKS : MOCK_LINKS.filter(l => l.type === filter)

  return (
    <div>
      {/* Hero */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5">Discover people & their work.</h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-md mb-4">Share your portfolio, YouTube, referral links, collab requests. Be found by the right people.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            {[{ v: '3,100+', l: 'profiles listed' }, { v: '12k+', l: 'link clicks today' }, { v: '640', l: 'collabs formed' }].map(s => (
              <div key={s.l}><div className="text-base font-bold text-gray-900">{s.v}</div><div className="text-xs text-gray-400 mt-0.5">{s.l}</div></div>
            ))}
          </div>
        </div>
        <div className="flex sm:flex-col gap-2 sm:min-w-[130px]">
          <button className="btn-primary flex-1 sm:flex-none text-center">+ Add my link</button>
          <button className="btn-outline flex-1 sm:flex-none text-center">Browse all</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        {LINK_TYPES.map(tag => (
          <button key={tag.value} onClick={() => setFilter(tag.value)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
              filter === tag.value ? 'bg-brand text-white border-brand' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
            }`}>
            {tag.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(link => (
          <div key={link.id} className="card flex flex-col">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${AVATAR_BG[link.type]}`}>
                {getInitials(link.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{link.name}</div>
                <div className="text-xs text-gray-400 truncate">{link.handle}</div>
              </div>
              <span className={`badge shrink-0 ${TYPE_STYLES[link.type]}`}>{TYPE_LABELS[link.type]}</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{link.desc}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-gray-400">{link.stat}</span>
              <button className="btn-primary text-xs px-3 py-1.5">{BTN_LABELS[link.type]}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
