import { getAllPosts, BlogPost } from '@/lib/blog'
import Link from 'next/link'
import Image from 'next/image'

export default function RelatedPosts({ currentSlug, category }: { currentSlug: string; category: string }) {
  const allPosts = getAllPosts()

  // First try same category, then any other posts
  const related = allPosts
    .filter(p => p.slug !== currentSlug)
    .sort((a, b) => {
      if (a.category === category && b.category !== category) return -1
      if (b.category === category && a.category !== category) return 1
      return 0
    })
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Continue reading</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-brand/30 hover:shadow-sm transition-all"
          >
            {post.image && (
              <div className="relative h-32 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-3">
              <span className="badge badge-brand text-xs mb-2 inline-block">{post.category}</span>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand transition-colors leading-snug line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-gray-400 mt-2">{post.readTime}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
