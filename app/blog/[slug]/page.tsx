import { getPost, getAllPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import BlogCTA from '@/components/shared/BlogCTA'
import RelatedPosts from '@/components/shared/RelatedPosts'

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

  const allPosts = getAllPosts()
  const otherPosts = allPosts
    .filter(p => p.slug !== slug)
    .slice(0, 8)

  const isTrip = post.tags?.some((t: string) =>
    ['carpool', 'trip', 'travel', 'carpooling'].includes(t.toLowerCase())
  )

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'SubSharePool',
      url: 'https://subsharepool.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SubSharePool',
      logo: {
        '@type': 'ImageObject',
        url: 'https://subsharepool.com/logo.png',
      },
    },
  }

  return (
    <>
      <Script
        id={`schema-article-${slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-10 items-start">

          {/* Main content */}
          <article className="flex-1 min-w-0">
            <Link href="/blog" className="text-sm text-brand hover:underline mb-6 inline-block">
              ← Back to Blog
            </Link>

            <div className="mb-8">
              <span className="badge badge-brand text-xs mb-3 inline-block">{post.category}</span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">{post.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
                <span>
                  {new Date(post.date).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              {post.image && (
                <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8">
                  <Image src={post.image} alt={post.title} fill className="object-cover" priority />
                </div>
              )}
            </div>

            {/* Inline CTA top */}
            <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Join SubSharePool — Free</p>
                <p className="text-xs text-gray-500 mt-0.5">Find people to split costs with worldwide</p>
              </div>
              <Link href="/?tab=subs" className="btn-primary text-xs px-4 py-2 shrink-0">
                Browse →
              </Link>
            </div>

            {/* Blog content */}
            <div className="
              prose prose-gray max-w-none
              prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-gray-900
              prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-900
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
              prose-li:text-gray-600 prose-li:mb-1
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-a:text-brand prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-brand prose-blockquote:bg-brand/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-gray-600
              prose-table:text-sm prose-table:w-full
              prose-thead:bg-gray-50
              prose-th:text-gray-700 prose-th:font-semibold prose-th:p-3 prose-th:text-left
              prose-td:text-gray-600 prose-td:p-3 prose-td:border-t prose-td:border-gray-100
              prose-tr:hover:bg-gray-50
              prose-code:text-brand prose-code:bg-brand/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-hr:border-gray-100 prose-hr:my-8
              prose-img:rounded-xl
            ">
              <MDXRemote
                source={post.content}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 mb-2">
              {post.tags?.map((tag: string) => (
                <span key={tag} className="badge badge-brand text-xs">#{tag}</span>
              ))}
            </div>

            <RelatedPosts currentSlug={slug} category={post.category} />
            <BlogCTA type={isTrip ? 'trips' : 'subs'} />

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link href="/blog" className="btn-outline text-sm">← Browse all articles</Link>
            </div>
          </article>

          {/* RIGHT SIDEBAR — desktop only */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-6">

              {/* Other articles */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-900 mb-4">📝 More Articles</p>
                <div className="space-y-3">
                  {otherPosts.map(p => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="flex gap-3 group hover:bg-gray-50 rounded-xl p-2 transition-colors"
                    >
                      {p.image && (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 line-clamp-2 group-hover:text-brand transition-colors leading-snug">
                          {p.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{p.readTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/blog"
                  className="block text-center text-xs text-brand hover:underline mt-4 pt-3 border-t border-gray-100"
                >
                  View all articles →
                </Link>
              </div>

              {/* Join CTA */}
              <div className="bg-brand rounded-2xl p-4 text-center">
                <p className="text-white font-bold mb-1 text-sm">Save money today</p>
                <p className="text-white/70 text-xs mb-3">
                  Split Netflix, Spotify, ChatGPT with trusted people
                </p>
                <Link
                  href="/join"
                  className="block bg-white text-brand text-xs font-semibold py-2 px-4 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Join Free →
                </Link>
              </div>

              {/* Popular categories */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-900 mb-3">🏷️ Categories</p>
                <div className="flex flex-wrap gap-2">
                  {['Save Money', 'Subscriptions', 'Trip Sharing', 'Make Money', 'Affiliate Marketing'].map(cat => (
                    <Link
                      key={cat}
                      href="/blog"
                      className="text-xs bg-gray-50 text-gray-600 hover:bg-brand/10 hover:text-brand px-2.5 py-1 rounded-full transition-colors border border-gray-100"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Referral CTA */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
                <p className="text-sm font-bold text-green-800 mb-1">💰 Earn ₹2 per referral</p>
                <p className="text-xs text-green-600 mb-3">
                  Refer friends to SubSharePool and earn via UPI
                </p>
                <Link
                  href="/dashboard"
                  className="block bg-green-600 text-white text-xs font-semibold py-2 px-4 rounded-full hover:bg-green-700 transition-colors"
                >
                  Get your referral link →
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </>
  )
}
