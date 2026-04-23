import { getPost, getAllPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'

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
    title: `${post.title} | SubSharePool`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
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
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          </div>
        )}
      </div>

      <div className="prose prose-gray max-w-none
        prose-headings:font-bold
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-gray-900
        prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-900
        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
        prose-li:text-gray-600 prose-li:mb-1
        prose-strong:text-gray-900 prose-strong:font-semibold
        prose-a:text-brand prose-a:no-underline hover:prose-a:underline
        prose-blockquote:border-l-brand prose-blockquote:bg-brand/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
        prose-table:text-sm prose-th:bg-gray-50 prose-th:text-gray-700 prose-td:text-gray-600
        prose-code:text-brand prose-code:bg-brand/5 prose-code:px-1 prose-code:rounded
        prose-hr:border-gray-100
      ">
        <MDXRemote source={post.content} />
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100">
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags?.map((tag: string) => (
            <span key={tag} className="badge badge-brand text-xs">#{tag}</span>
          ))}
        </div>
        <div className="bg-brand/5 border border-brand/20 rounded-xl p-5">
          <p className="font-semibold text-gray-900 mb-2">Ready to start saving?</p>
          <p className="text-sm text-gray-600 mb-4">Join thousands of Indians already saving money on SubSharePool.</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/?tab=subs" className="btn-primary inline-block text-sm">Browse Listings</Link>
            <Link href="/?tab=subs" className="btn-outline inline-block text-sm">Post Your Share</Link>
          </div>
        </div>
      </div>
    </article>
  )
}
