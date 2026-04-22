import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Save Money on AI Tools Like ChatGPT, Midjourney and More',
  description: 'AI tools are expensive. Learn how to split AI subscription costs with your team or friends legally.',
}

export default function Post5() {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" className="text-sm text-brand hover:underline mb-6 inline-block">← Back to Blog</Link>
      <div className="mb-8">
        <span className="badge badge-brand text-xs mb-3 inline-block">AI Tools</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">
          How to Save Money on AI Tools Like ChatGPT, Midjourney and More
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>March 20, 2026</span><span>·</span><span>4 min read</span>
        </div>
      </div>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          AI tools have become essential for productivity, creativity and business. But the costs add up quickly — ChatGPT Plus alone costs ₹1,700/month. Here's how to get access to premium AI tools without breaking the bank.
        </p>
        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Most Popular AI Tools and Their Costs</h2>
        {[
          { name: 'ChatGPT Plus', price: '₹1,700/month', users: 1, note: 'GPT-4 access, advanced features' },
          { name: 'Midjourney', price: '₹830/month', users: 1, note: 'AI image generation' },
          { name: 'GitHub Copilot', price: '₹830/month', users: 1, note: 'AI code completion' },
          { name: 'Notion AI', price: '₹830/month', users: 1, note: 'AI writing and organization' },
        ].map((tool, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 mb-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">{tool.name}</p>
              <p className="text-xs text-gray-400">{tool.note}</p>
            </div>
            <p className="text-brand font-bold text-sm">{tool.price}</p>
          </div>
        ))}
        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How to Split AI Tool Costs</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Many AI tools can be shared through API access or team plans. On SubSharePool, you can find people to split these costs with. Post your AI tool share and connect with others who need the same tools.
        </p>
        <div className="bg-brand/5 border border-brand/20 rounded-xl p-5 mt-8">
          <p className="font-semibold text-gray-900 mb-2">Find AI tool sharing partners!</p>
          <p className="text-sm text-gray-600 mb-3">Split the cost of premium AI tools with trusted people on SubSharePool.</p>
          <Link href="/?tab=subs" className="btn-primary inline-block text-sm">Browse AI Tool Shares</Link>
        </div>
      </div>
    </article>
  )
}
