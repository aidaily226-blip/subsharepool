'use client'
import Link from 'next/link'
import { Users, Package, FileText, Flag } from 'lucide-react'

const STATS = [
  { label: 'Total Users', value: '1,284', icon: Users, color: 'bg-blue-50 text-blue-600' },
  { label: 'Active Listings', value: '3,847', icon: Package, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Blog Posts', value: '24', icon: FileText, color: 'bg-purple-50 text-purple-600' },
  { label: 'Flagged Posts', value: '3', icon: Flag, color: 'bg-red-50 text-red-600' },
]

const QUICK_LINKS = [
  { href: '/admin/users', label: 'Manage Users', desc: 'View, block or unblock accounts' },
  { href: '/admin/listings', label: 'Manage Listings', desc: 'Review and delete listings' },
  { href: '/admin/blog', label: 'Blog Posts', desc: 'Write, edit, publish posts' },
  { href: '/admin/blog/new', label: '+ New Blog Post', desc: 'Write a new article' },
]

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {QUICK_LINKS.map(link => (
          <Link key={link.href} href={link.href} className="card">
            <div className="text-sm font-medium text-gray-900 mb-1">{link.label}</div>
            <div className="text-xs text-gray-400">{link.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
