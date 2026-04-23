import { getAllPosts } from '@/lib/blog'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Tips on Saving Money & Sharing Subscriptions',
  description: 'Read our latest articles on saving money by sharing subscriptions, splitting trip costs, and more.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Blog</h1>
        <p className="text-gray-400">Tips on saving money, sharing subscriptions, and smart travel.</p>
      </div>

      {posts.length > 0 && (
        <Link href={`/blog/${posts[0].slug}`} className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-all mb-6">
          <div className="relative h-56 sm:h-72 w-full">
            <Image src={posts[0].image} alt={posts[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <span className="badge bg-white/20 text-white text-xs mb-2 inline-block">{posts[0].category}</span>
              <h2 className="text-white font-bold text-xl leading-snug mb-1">{posts[0].title}</h2>
              <p className="text-white/70 text-xs">{posts[0].date} · {posts[0].readTime}</p>
            </div>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {posts.slice(1).map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-all">
            <div className="relative h-40 w-full">
              <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-brand text-xs">{post.category}</span>
                <span className="text-xs text-gray-400">{post.readTime}</span>
              </div>
              <h2 className="font-bold text-gray-900 mb-1 group-hover:text-brand transition-colors text-sm leading-snug">{post.title}</h2>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">{post.excerpt}</p>
              <p className="text-xs text-gray-400">{post.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}