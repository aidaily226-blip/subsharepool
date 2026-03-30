'use client'
import { useState } from 'react'
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react'

const FEED_TAGS = [
  { value: 'all', label: 'All' },
  { value: 'deal', label: '🔥 Hot Deals' },
  { value: 'idea', label: '💡 Ideas' },
  { value: 'question', label: '❓ Questions' },
  { value: 'collab', label: '🤝 Collabs' },
]

const TAG_STYLES: Record<string, string> = {
  deal: 'bg-emerald-50 text-emerald-700',
  idea: 'bg-purple-50 text-purple-700',
  question: 'bg-amber-50 text-amber-700',
  collab: 'bg-blue-50 text-blue-700',
}

const TAG_LABELS: Record<string, string> = {
  deal: '🔥 Hot Deal',
  idea: '💡 Idea',
  question: '❓ Question',
  collab: '🤝 Collab',
}

const MOCK_FEED = [
  { id: '1', author: 'Rahul K.', initials: 'RK', avatarBg: 'bg-red-100 text-red-700', time: '2 min ago', tag: 'deal', body: "Amazon Prime is ₹299/month but if you split with 3 people it's ₹75/person. Prime Video + Music + free delivery. Someone just listed a slot — grab it fast.", likes: 34, replies: 8, linkTitle: 'Amazon Prime — 3 slots open', linkUrl: 'subsharepool.com/share/prime' },
  { id: '2', author: 'Sneha V.', initials: 'SV', avatarBg: 'bg-purple-100 text-purple-700', time: '18 min ago', tag: 'idea', body: "What if SubSharePool had a credit system? You earn credits by sharing your subscription — and spend credits to unlock shared plans. No cash exchange needed. Would that work?", likes: 91, replies: 24 },
  { id: '3', author: 'Dev L.', initials: 'DL', avatarBg: 'bg-emerald-100 text-emerald-700', time: '1 hr ago', tag: 'collab', body: "Building a SaaS for college students — need a UI/UX designer for 2–3 weeks. Revenue share or portfolio credit. React frontend, already have backend. DM me.", likes: 17, replies: 5 },
  { id: '4', author: 'Meena J.', initials: 'MJ', avatarBg: 'bg-amber-100 text-amber-700', time: '3 hr ago', tag: 'question', body: "Is sharing a ChatGPT Plus account actually safe? The team plan shows usage per member but can others see your conversations? Has anyone had issues?", likes: 52, replies: 31 },
]

export default function FeedSection() {
  const [filter, setFilter] = useState('all')
  const [body, setBody] = useState('')
  const filtered = filter === 'all' ? MOCK_FEED : MOCK_FEED.filter(p => p.tag === filter)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Compose */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 flex gap-3">
        <div className="w-8 h-8 rounded-full bg-brand text-white text-xs font-medium flex items-center justify-center shrink-0">AJ</div>
        <div className="flex-1">
          <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-gray-400 resize-none" rows={2} placeholder="Share a deal, idea, or question with the community..." />
          <div className="flex justify-end mt-2">
            <button className="btn-primary text-xs px-4">Post</button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        {FEED_TAGS.map(tag => (
          <button key={tag.value} onClick={() => setFilter(tag.value)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
              filter === tag.value ? 'bg-brand text-white border-brand' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
            }`}>
            {tag.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-3">
        {filtered.map(post => (
          <div key={post.id} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${post.avatarBg}`}>{post.initials}</div>
              <div>
                <div className="text-sm font-medium text-gray-900">{post.author}</div>
                <div className="text-xs text-gray-400">{post.time}</div>
              </div>
              <span className={`badge ml-auto ${TAG_STYLES[post.tag]}`}>{TAG_LABELS[post.tag]}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">{post.body}</p>
            {post.linkTitle && (
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-base shrink-0">📦</div>
                <div>
                  <div className="text-xs font-medium text-gray-900">{post.linkTitle}</div>
                  <div className="text-xs text-gray-400">{post.linkUrl}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600"><ThumbsUp size={13} /> {post.likes}</button>
              <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600"><MessageCircle size={13} /> {post.replies} replies</button>
              <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 ml-auto"><Share2 size={13} /> Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
