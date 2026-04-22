import { notFound } from 'next/navigation'
import Post1 from './posts/post1'
import Post2 from './posts/post2'
import Post3 from './posts/post3'
import Post4 from './posts/post4'
import Post5 from './posts/post5'

const posts: Record<string, React.ComponentType> = {
  'how-to-split-netflix-with-friends': Post1,
  'ultimate-guide-to-carpooling-india': Post2,
  'best-subscriptions-to-share-2026': Post3,
  'how-to-find-travel-buddy-india': Post4,
  'save-money-on-ai-tools-2026': Post5,
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const PostComponent = posts[slug]
  if (!PostComponent) notFound()
  return <PostComponent />
}

export async function generateStaticParams() {
  return Object.keys(posts).map(slug => ({ slug }))
}
