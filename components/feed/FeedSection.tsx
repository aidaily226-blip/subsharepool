'use client'
import { useState } from 'react'
import FilterBar from '@/components/shared/FilterBar'
import FeedPostCard from './FeedPostCard'
import { FEED_TAGS } from '@/lib/constants'
import { FeedPost } from '@/lib/types'

const MOCK_FEED: FeedPost[] = [
  { id:'1', user_id:'u1', author:'Rahul K.', body:"Amazon Prime is ₹299/month but if you split with 3 people it's ₹75/person. Prime Video + Music + free delivery. Someone just listed a slot — grab it fast.", tag:'deal', likes:34, replies:8, link_icon:'📦', link_title:'Amazon Prime — 3 slots open', link_url:'subsharepool.com/share/prime-rk', created_at: new Date(Date.now() - 2 * 60000).toISOString() },
  { id:'2', user_id:'u2', author:'Sneha V.', body:"What if SubSharePool had a credit system? You earn credits by sharing your subscription or posting useful content — and spend credits to unlock shared plans. No cash exchange needed. Would that work?", tag:'idea', likes:91, replies:24, created_at: new Date(Date.now() - 18 * 60000).toISOString() },
  { id:'3', user_id:'u3', author:'Dev L.', body:"Building a SaaS for college students — need a UI/UX designer for 2–3 weeks. Revenue share or portfolio credit. React frontend, already have backend. DM me.", tag:'collab', likes:17, replies:5, created_at: new Date(Date.now() - 60 * 60000).toISOString() },
  { id:'4', user_id:'u4', author:'Meena J.', body:"Is sharing a ChatGPT Plus account actually safe? The team plan shows usage per member but can others see your conversations? Has anyone had issues with this?", tag:'question', likes:52, replies:31, created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
]

export default function FeedSection() {
  const [filter, setFilter] = useState('all')
  const [body, setBody] = useState('')

  const filtered = filter === 'all' ? MOCK_FEED : MOCK_FEED.filter(p => p.tag === filter)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Compose */}
      <div className="card-static mb-4 flex gap-3">
        <div className="w-8 h-8 rounded-full bg-brand text-white text-xs font-medium flex items-center justify-center shrink-0">
          AJ
        </div>
        <div className="flex-1">
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            className="textarea text-sm"
            rows={2}
            placeholder="Share a deal, idea, or question with the community..."
          />
          <div className="flex justify-end mt-2">
            <button className="btn-primary text-xs px-4">Post</button>
          </div>
        </div>
      </div>

      <FilterBar tags={FEED_TAGS} onChange={setFilter} />

      <div className="flex flex-col gap-3">
        {filtered.map((post, i) => (
          <FeedPostCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </div>
  )
}
