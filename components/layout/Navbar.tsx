'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Search, Menu, X, MessageSquare, LogOut, User, Shield } from 'lucide-react'
import { getInitials } from '@/lib/utils'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const userName = session?.user?.name ?? ''
  const userEmail = session?.user?.email ?? ''
  const userImage = session?.user?.image ?? ''
  const userRole = (session?.user as { role?: string })?.role

  return (
    <nav className="bg-cream border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 h-14">
          <Link href="/" className="text-lg font-bold tracking-tight text-gray-900 shrink-0">
            Sub<span className="text-brand">Share</span>Pool
          </Link>

          <div className="hidden sm:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search listings..." className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
          </div>

          <div className="flex-1" />

          <div className="hidden sm:flex items-center gap-2">
            <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">Blog</Link>

            {session ? (
              <>
                <Link href="/messages" className="p-2 text-gray-500 hover:text-gray-700">
                  <MessageSquare size={18} />
                </Link>
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 hover:opacity-80">
                    {userImage ? (
                      <Image src={userImage} alt={userName} width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand text-white text-xs font-medium flex items-center justify-center">
                        {getInitials(userName || 'U')}
                      </div>
                    )}
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-10 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium truncate">{userName}</p>
                        <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                      </div>
                      <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                        <User size={14} /> Profile
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
                <button onClick={() => signIn('google')} className="btn-outline">Sign in</button>
                <button onClick={() => signIn('google')} className="btn-primary">Join free</button>
              </>
            )}
          </div>

          <button className="sm:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
          <input type="text" placeholder="Search..." className="input" />
          <Link href="/blog" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Blog</Link>
          {session ? (
            <>
              <Link href="/messages" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Messages</Link>
              <button onClick={() => signOut()} className="text-sm text-red-500 text-left">Sign out</button>
            </>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => signIn('google')} className="btn-outline flex-1">Sign in</button>
              <button onClick={() => signIn('google')} className="btn-primary flex-1">Join free</button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}