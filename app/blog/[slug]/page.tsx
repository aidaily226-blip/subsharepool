import { getPost, getAllPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image, width: 1200, height: 630 }],
      type: 'article',
      url: `https://subsharepool.com/blog/${slug}`,
      siteName: 'SubSharePool',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
    alternates: {
      canonical: `https://subsharepool.com/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" className="text-sm text-brand hover:underline mb-6 inline-block">
        ← Back to Blog
      </Link>

      <div className="mb-8">
        <span className="badge badge-brand text-xs mb-3 inline-block">{post.category}</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
          <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
        {post.image && (
          <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
        )}
      </div>

      <div
        className="prose prose-gray max-w-none prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          {post.tags?.map(tag => (
            <span key={tag} className="badge badge-brand text-xs">#{tag}</span>
          ))}
        </div>
      </div>
    </article>
  )
}