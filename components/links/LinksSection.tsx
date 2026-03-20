'use client'
import { useState } from 'react'
import Hero from '@/components/shared/Hero'
import FilterBar from '@/components/shared/FilterBar'
import LinkCard from './LinkCard'
import { LINK_TYPES } from '@/lib/constants'
import { Link as LinkType } from '@/lib/types'

const MOCK_LINKS: LinkType[] = [
  { id:'1', user_id:'u1', name:'Aryan Kapoor', handle:'@aryantech', type:'youtube', description:'Tech reviews & budget phones. 84k subscribers. Open for collab with similar creators.', url:'#', stat:'84k subs · 2.1M views', created_at:'' },
  { id:'2', user_id:'u2', name:'Sanya Mehta', handle:'@sanyacreates', type:'instagram', description:'Lifestyle & travel content. 41k followers. Looking for brand shoutout exchanges & reels collabs.', url:'#', stat:'41k followers', created_at:'' },
  { id:'3', user_id:'u3', name:'Rohan Verma', handle:'rohanverma.dev', type:'portfolio', description:'Full-stack dev. Built 12+ products. Open to freelance, startup equity roles, side-project collabs.', url:'#', stat:'12 projects · open to work', created_at:'' },
  { id:'4', user_id:'u4', name:'Tanvi Nair', handle:'@tanvifin', type:'referral', description:'Zerodha referral — get ₹300 cashback when you open a demat account using my link.', url:'#', stat:'₹300 cashback for you', created_at:'' },
  { id:'5', user_id:'u5', name:'Dev Studio', handle:'devstudio.in', type:'collab', description:'Design agency looking for freelance developers. Revenue share or fixed pay. React + Figma projects.', url:'#', stat:'3 open roles', created_at:'' },
  { id:'6', user_id:'u6', name:'Priya M.', handle:'affiliate links', type:'affiliate', description:'Hostinger 80% off, Notion Plus free trial, Canva Pro — curated affiliate links that actually work.', url:'#', stat:'3 active deals', created_at:'' },
]

export default function LinksSection() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? MOCK_LINKS : MOCK_LINKS.filter(l => l.type === filter)

  return (
    <div>
      <Hero
        title="Discover people & their work."
        description="Share your portfolio, YouTube, referral links, collab requests, and shoutout exchanges. Be found by the right people."
        stats={[
          { value: '3,100+', label: 'profiles listed' },
          { value: '12k+', label: 'link clicks today' },
          { value: '640', label: 'collabs formed' },
        ]}
        primaryBtn="+ Add my link"
        secondaryBtn="Browse all"
      />
      <FilterBar tags={LINK_TYPES} onChange={setFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(link => <LinkCard key={link.id} link={link} />)}
      </div>
    </div>
  )
}
