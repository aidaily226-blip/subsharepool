'use client'
import { useState } from 'react'
import Hero from '@/components/shared/Hero'
import FilterBar from '@/components/shared/FilterBar'
import SubCard from './SubCard'
import { SUB_CATEGORIES } from '@/lib/constants'
import { Subscription } from '@/lib/types'

const MOCK_SUBS: Subscription[] = [
  { id:'1', user_id:'u1', icon:'🎬', icon_bg:'#FFECEC', name:'Netflix Premium', description:'4K UHD, separate profile, no ads. UPI payment.', price:149, total_slots:4, filled_slots:2, category:'streaming', featured:false, created_at:'' },
  { id:'2', user_id:'u2', icon:'🌐', icon_bg:'#E6F1FB', name:'Hostinger Business', description:'Subdomain + 10GB storage. Great for side projects.', price:89, total_slots:5, filled_slots:2, category:'hosting', featured:true, created_at:'' },
  { id:'3', user_id:'u3', icon:'🤖', icon_bg:'#E1F5EE', name:'ChatGPT Plus', description:'GPT-4o full access. Shared team plan.', price:299, total_slots:2, filled_slots:1, category:'ai', featured:false, created_at:'' },
  { id:'4', user_id:'u4', icon:'🎨', icon_bg:'#FBEAF0', name:'Figma Professional', description:'Full editor, dev mode, unlimited projects.', price:199, total_slots:4, filled_slots:2, category:'design', featured:false, created_at:'' },
  { id:'5', user_id:'u5', icon:'🔒', icon_bg:'#FAEEDA', name:'NordVPN 6-device', description:'One device slot. All regions, no logs.', price:79, total_slots:6, filled_slots:2, category:'vpn', featured:false, created_at:'' },
  { id:'6', user_id:'u6', icon:'🎵', icon_bg:'#E1F5EE', name:'Spotify Duo', description:'Ad-free, offline mode, full library.', price:99, total_slots:2, filled_slots:1, category:'music', featured:false, created_at:'' },
  { id:'7', user_id:'u7', icon:'📦', icon_bg:'#F5F4EF', name:'Notion Team', description:'Full workspace, unlimited blocks, integrations.', price:129, total_slots:5, filled_slots:2, category:'saas', featured:false, created_at:'' },
  { id:'8', user_id:'u8', icon:'🔗', icon_bg:'#EAF3DE', name:'Dev Portfolio Host', description:'Full-stack dev — open for collabs & projects.', price:null, total_slots:1, filled_slots:0, category:'hosting', featured:false, created_at:'' },
]

export default function SubscriptionsSection() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? MOCK_SUBS : MOCK_SUBS.filter(s => s.category === filter)

  return (
    <div>
      <Hero
        title="Split subscriptions. Save money."
        description="Join shared plans for Netflix, Spotify, ChatGPT, Figma and more. Pay only your share — verified by the community."
        stats={[
          { value: '8,400+', label: 'active shares' },
          { value: '31k+', label: 'members saving' },
          { value: 'avg 68%', label: 'cost saved' },
        ]}
        primaryBtn="Find a plan"
        secondaryBtn="List my plan"
      />
      <FilterBar tags={SUB_CATEGORIES} onChange={setFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(sub => (
          <SubCard key={sub.id} sub={sub} />
        ))}
      </div>
    </div>
  )
}
