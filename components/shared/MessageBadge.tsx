'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function MessageBadge() {
  const { data: session } = useSession()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (!session) return
    fetchUnread()
    // Poll every 30 seconds
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [session])

  const fetchUnread = async () => {
    try {
      const res = await fetch('/api/messages/unread-count')
      const data = await res.json()
      setUnread(data.count || 0)
    } catch {}
  }

  return (
    <Link
      href="/messages"
      className="relative p-2 text-gray-500 hover:text-brand transition-colors"
    >
      <MessageSquare size={18} />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  )
}
