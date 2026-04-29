'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Search, Menu, X, MessageSquare, LogOut, User, Shield } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const TABS = [
  { id: 'subs', label: '📦 Subscriptions', href: '/?tab=subs' },
  { id: 'trips', label: '✈️ Trips', href: '/?tab=trips' },
  { id: 'links', label: '🔗 Links', href: '/?tab=links' },
  { id: 'feed', label: '💬 Community', href: '/?tab=feed' },
]

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'subs'
  const isHome = pathname === '/'

  const userName = session?.user?.name ?? ''
  const userEmail = session?.user?.email ?? ''
  const userImage = session?.user?.image ?? ''
  const userRole = (session?.user as { role?: string })?.role

  return (
    <nav className="bg-cream border-b border-gray-200 sticky top-0 z-50">
      {/* Main navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 h-14">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <Image src="/logo.png" alt="SubSharePool" width={32} height={32} />
            <span className="text-base font-bold tracking-tight text-gray-900 hidden sm:block">
              Sub<span className="text-brand">Share</span>Pool
            </span>
          </Link>

          {/* Search — desktop */}
          <div className="hidden sm:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search listings..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value.trim()
                    if (val) window.location.href = `/search?q=${encodeURIComponent(val)}`
                  }
                }}
              />
            </div>
          </div>

          <div className="flex-1" />

          {/* Right side — desktop */}
          <div className="hidden sm:flex items-center gap-1">
            <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">Blog</Link>

            {session ? (
              <>
                <Link href="/messages" className="p-2 text-gray-500 hover:text-brand transition-colors">
                  <MessageSquare size={18} />
                </Link>
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 hover:opacity-80 ml-1">
                    {userImage ? (
                      <Image src={userImage} alt={userName} width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand text-white text-xs font-medium flex items-center justify-center">
                        {getInitials(userName || 'U')}
                      </div>
                    )}
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-10 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium truncate">{userName}</p>
                        <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                        📦 My Dashboard
                      </Link>
                      <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                        <User size={14} /> Profile
                      </Link>
                      <Link href="/messages" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                        <MessageSquare size={14} /> Messages
                      </Link>
                      {userRole === 'admin' && (
                        <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                          <Shield size={14} /> Admin
                        </Link>
                      )}
                      <button onClick={() => signOut()} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left">
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => signIn('google')} className="btn-outline text-sm px-3 py-1.5">Sign in</button>
                <button onClick={() => signIn('google')} className="btn-primary text-sm px-3 py-1.5">Join free</button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="sm:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Tabs row — shows on homepage */}
      {isHome && (
        <div className="border-t border-gray-100 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {TABS.map(tab => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                    activeTab === tab.id
                      ? 'border-brand text-brand font-medium'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
          {/* Search */}
          <div className="relative mb-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val) { window.location.href = `/search?q=${encodeURIComponent(val)}`; setMenuOpen(false) }
                }
              }}
            />
          </div>

          {/* Section tabs */}
          <p className="text-xs text-gray-400 font-medium px-1 mt-1 mb-1">Browse</p>
          {TABS.map(tab => (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                isHome && activeTab === tab.id
                  ? 'bg-brand/10 text-brand font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 my-2" />

          {/* Other links */}
          <Link href="/blog" className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
            📝 Blog
          </Link>

          {session ? (
            <>
              <Link href="/dashboard" className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                📦 My Dashboard
              </Link>
              <Link href="/messages" className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                💬 Messages
              </Link>
              <Link href="/profile" className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                👤 Profile
              </Link>
              {userRole === 'admin' && (
                <Link href="/admin" className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  🛡️ Admin
                </Link>
              )}
              <button onClick={() => signOut()} className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg text-left">
                🚪 Sign out
              </button>
            </>
          ) : (
            <div className="flex gap-2 mt-1">
              <button onClick={() => signIn('google')} className="btn-outline flex-1">Sign in</button>
              <button onClick={() => signIn('google')} className="btn-primary flex-1">Join free</button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
