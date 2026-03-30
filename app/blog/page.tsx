import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — Tips, Guides & Deals',
  description: 'Learn how to save money by sharing subscriptions, find travel companions, and discover the best community deals.',
}

const MOCK_POSTS = [
  { slug: 'how-to-split-netflix', title: 'How to safely split Netflix with strangers in 2025', excerpt: 'A complete guide to sharing Netflix accounts while keeping your data private and your wallet happy.', date: 'Mar 15, 2025', readTime: '5 min read', category: 'Guide' },
  { slug: 'best-subscriptions-to-share', title: 'Top 10 subscriptions worth splitting with others', excerpt: 'From Spotify to ChatGPT Plus — these are the subscriptions where sharing saves you the most money.', date: 'Mar 10, 2025', readTime: '7 min read', category: 'Tips' },
  { slug: 'carpooling-guide', title: 'The complete guide to carpooling', excerpt: 'How to find reliable carpool partners, negotiate costs, and stay safe on long-distance road trips.', date: 'Mar 5, 2025', readTime: '8 min read', category: 'Travel' },
]

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-sm text-gray-400">Tips, guides, and deals from the SubSharePool community.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_POSTS.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card group">
            <div className="h-36 bg-gray-50 rounded-lg mb-3 flex items-center justify-center text-3xl">📝</div>
            <span className="badge badge-brand text-xs mb-2 inline-block">{post.category}</span>
            <h2 className="text-sm font-semibold text-gray-900 leading-snug mb-2 group-hover:text-brand transition-colors">{post.title}</h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">{post.excerpt}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{post.date}</span><span>·</span><span>{post.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
