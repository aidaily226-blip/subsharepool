'use client'
import Link from 'next/link'


const MOCK_POSTS = [
  { id:'1', title:'How to safely split Netflix with strangers in 2024', published:true, date:'Mar 15, 2024' },
  { id:'2', title:'Top 10 subscriptions worth splitting with others', published:true, date:'Mar 10, 2024' },
  { id:'3', title:'The complete guide to carpooling in India', published:false, date:'Mar 5, 2024' },
]

export default function AdminBlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Blog Posts</h1>
        <Link href="/admin/blog/new" className="btn-primary">+ New Post</Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_POSTS.map(post => (
                <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{post.title}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${post.published ? 'badge-success' : 'bg-gray-100 text-gray-500'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{post.date}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link href={`/admin/blog/${post.id}`} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      Edit
                    </Link>
                    <button className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
