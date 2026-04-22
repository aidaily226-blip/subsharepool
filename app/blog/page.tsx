import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Tips on Saving Money & Sharing Subscriptions',
  description: 'Read our latest articles on saving money by sharing subscriptions, splitting trip costs, and more.',
}

const posts = [
  {
    slug: 'how-to-split-netflix-with-friends',
    title: 'How to Split Netflix With Friends and Save 60% Every Month',
    excerpt: 'Netflix sharing is one of the easiest ways to cut your monthly bills. Here\'s a step-by-step guide to safely split your subscription with trusted people.',
    date: 'April 15, 2026',
    readTime: '5 min read',
    category: 'Subscriptions',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&q=80',
  },
  {
    slug: 'ultimate-guide-to-carpooling-india',
    title: 'The Ultimate Guide to Carpooling in India: Save Money on Every Trip',
    excerpt: 'Carpooling is booming in India. Learn how to find reliable travel partners, split fuel costs, and make your daily commute or road trips much cheaper.',
    date: 'April 10, 2026',
    readTime: '7 min read',
    category: 'Trip Sharing',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
  },
  {
    slug: 'best-subscriptions-to-share-2026',
    title: '10 Best Subscriptions to Share With Friends in 2026',
    excerpt: 'From streaming to productivity tools, these are the top subscriptions worth splitting. Some can save you up to ₹500 per month per person.',
    date: 'April 5, 2026',
    readTime: '6 min read',
    category: 'Subscriptions',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80',
  },
  {
    slug: 'how-to-find-travel-buddy-india',
    title: 'How to Find a Reliable Travel Buddy for Your Next Trip in India',
    excerpt: 'Traveling alone is expensive and sometimes lonely. Here\'s how to find trustworthy travel companions for your next adventure across India.',
    date: 'March 28, 2026',
    readTime: '5 min read',
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  },
  {
    slug: 'save-money-on-ai-tools-2026',
    title: 'How to Save Money on AI Tools Like ChatGPT, Midjourney and More',
    excerpt: 'AI tools are expensive. But did you know you can share many of them legally? Here\'s how to split AI subscription costs with your team or friends.',
    date: 'March 20, 2026',
    readTime: '4 min read',
    category: 'AI Tools',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
  },
]

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Blog</h1>
        <p className="text-gray-400">Tips on saving money, sharing subscriptions, and smart travel.</p>
      </div>

      {/* Featured post */}
      <Link href={`/blog/${posts[0].slug}`} className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-all mb-6">
        <div className="relative h-56 sm:h-72 w-full">
          <Image
            src={posts[0].image}
            alt={posts[0].title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            <span className="badge bg-white/20 text-white text-xs mb-2 inline-block backdrop-blur-sm">{posts[0].category}</span>
            <h2 className="text-white font-bold text-xl leading-snug mb-1">{posts[0].title}</h2>
            <p className="text-white/70 text-xs">{posts[0].date} · {posts[0].readTime}</p>
          </div>
        </div>
      </Link>

      {/* Rest of posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {posts.slice(1).map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all">
            <div className="relative h-40 w-full">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-brand text-xs">{post.category}</span>
                <span className="text-xs text-gray-400">{post.readTime}</span>
              </div>
              <h2 className="font-bold text-gray-900 mb-1 group-hover:text-brand transition-colors leading-snug text-sm">
                {post.title}
              </h2>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">{post.excerpt}</p>
              <p className="text-xs text-gray-400">{post.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
