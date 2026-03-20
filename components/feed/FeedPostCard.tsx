import { FeedPost as FeedPostType } from '@/lib/types'
import { FEED_TAG_STYLES } from '@/lib/constants'
import { getInitials, timeAgo } from '@/lib/utils'
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react'

const TAG_LABELS: Record<string, string> = {
  deal: '🔥 Hot Deal',
  idea: '💡 Idea',
  question: '❓ Question',
  collab: '🤝 Collab',
}

const AVATAR_COLORS = [
  { bg: '#FCEBEB', color: '#A32D2D' },
  { bg: '#EEEDFE', color: '#534AB7' },
  { bg: '#E1F5EE', color: '#0F6E56' },
  { bg: '#FAEEDA', color: '#854F0B' },
]

export default function FeedPostCard({ post, index }: { post: FeedPostType; index: number }) {
  const av = AVATAR_COLORS[index % AVATAR_COLORS.length]

  return (
    <div className="card-static hover:border-gray-200 transition-colors">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
          style={{ background: post.user?.image ? 'transparent' : av.bg, color: av.color }}
        >
{getInitials(post.user?.name || 'U')}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{post.user?.name || 'Anonymous'}</div>
          <div className="text-xs text-gray-400">{timeAgo(post.created_at || new Date().toISOString())}</div>
        </div>
        <span className={`badge ml-auto ${FEED_TAG_STYLES[post.tag]}`}>
          {TAG_LABELS[post.tag]}
        </span>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-3">{post.body}</p>

      {post.link_title && (
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-base shrink-0">
            {post.link_icon}
          </div>
          <div>
            <div className="text-xs font-medium text-gray-900">{post.link_title}</div>
            <div className="text-xs text-gray-400">{post.link_url}</div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <ThumbsUp size={13} /> {post.likes}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <MessageCircle size={13} /> {post.replies} replies
        </button>
        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors ml-auto">
          <Share2 size={13} /> Share
        </button>
      </div>
    </div>
  )
}
