'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'

interface FeedPost {
  id: string
  body: string
  tag: string
  likes: number
  link_title: string
  link_url: string
  link_icon: string
  created_at: string
  users: { id: string; name: string; image: string }
}

const TAG_COLORS: Record<string, string> = {
  deal: 'bg-green-50 text-green-700',
  idea: 'bg-blue-50 text-blue-700',
  question: 'bg-yellow-50 text-yellow-700',
  collab: 'bg-purple-50 text-purple-700',
}

const TAG_ICONS: Record<string, string> = {
  deal: '🤑',
  idea: '💡',
  question: '❓',
  collab: '🤝',
}

const TAGS = ['deal', 'idea', 'question', 'collab']

export default function FeedSection() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTag, setActiveTag] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    body: '',
    tag: 'idea',
    link_title: '',
    link_url: '',
    link_icon: '',
  })

  useEffect(() => {
    fetchPosts()
  }, [activeTag])

  const fetchPosts = async () => {
    setLoading(true)
    const url = activeTag === 'all' ? '/api/feed' : `/api/feed?tag=${activeTag}`
    const res = await fetch(url)
    const json = await res.json()
    setPosts(Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []))
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!session) { signIn('google'); return }
    if (!form.body) return
    setSubmitting(true)
    const res = await fetch('/api/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ body: '', tag: 'idea', link_title: '', link_url: '', link_icon: '' })
      setShowForm(false)
      fetchPosts()
    }
    setSubmitting(false)
  }

  const handleLike = async (id: string) => {
    await fetch(`/api/feed/${id}/like`, { method: 'POST' })
    fetchPosts()
  }

  return (
    <div>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Feed</h2>
        <p className="text-gray-400 text-sm mb-4">Share deals, ideas, questions and find collaborators in the community.</p>
        <div className="flex gap-6">
          <div><p className="text-xl font-bold text-gray-900">8,400+</p><p className="text-xs text-gray-400">posts shared</p></div>
          <div><p className="text-xl font-bold text-gray-900">2.1k</p><p className="text-xs text-gray-400">active members</p></div>
          <div><p className="text-xl font-bold text-gray-900">500+</p><p className="text-xs text-gray-400">deals found</p></div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => setActiveTag('all')} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${activeTag === 'all' ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            All
          </button>
          {TAGS.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${activeTag === tag ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
              {TAG_ICONS[tag]} {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={() => session ? setShowForm(!showForm) : signIn('google')} className="btn-primary shrink-0 ml-3">
          + Post
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">New Post</h3>
          <div className="flex flex-col gap-3">
            <textarea
              className="input"
              placeholder="Share a deal, idea, question or collab request..."
              rows={3}
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
            />
            <select className="input" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}>
              {TAGS.map(t => <option key={t} value={t}>{TAG_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <input className="input" placeholder="Link title (optional)" value={form.link_title} onChange={e => setForm({ ...form, link_title: e.target.value })} />
            <input className="input" placeholder="Link URL (optional)" value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary">{submitting ? 'Posting...' : 'Post'}</button>
            <button onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse h-24" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">💬</p>
          <p className="font-medium">No posts yet</p>
          <p className="text-sm mt-1">Be the first to post!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand text-white text-xs font-medium flex items-center justify-center shrink-0">
                    {post.users?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{post.users?.name}</p>
                    <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`badge text-xs ${TAG_COLORS[post.tag]}`}>
                  {TAG_ICONS[post.tag]} {post.tag}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3">{post.body}</p>

              {post.link_title && post.link_url && (
                <a
                  href={post.link_url.startsWith('http') ? post.link_url : `https://${post.link_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-50 border border-gray-100 rounded-lg p-3 mb-3 hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-800">{post.link_title}</p>
                  <p className="text-xs text-gray-400 truncate">{post.link_url}</p>
                </a>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand transition-colors"
                >
                  <span>❤️</span>
                  <span>{post.likes || 0} likes</span>
                </button>
                <button
                  onClick={() => window.location.href = `/messages?userId=${post.users?.id}`}
                  className="btn-outline text-xs py-1.5 px-3"
                >
                  💬 Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
