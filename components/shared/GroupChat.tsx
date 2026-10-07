'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import { X, Send } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Message {
  id: string
  body: string
  user_id: string
  created_at: string
  users: { id: string; name: string; image: string }
}

interface GroupChatProps {
  listingId: string
  listingType: 'subscription' | 'trip'
  listingName: string
  onClose: () => void
}

export default function GroupChat({ listingId, listingType, listingName, onClose }: GroupChatProps) {
  const { data: session } = useSession()
  const [chatId, setChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [memberCount, setMemberCount] = useState(0)
  const [currentUserId, setCurrentUserId] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (session) fetchChat()
  }, [session])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!chatId) return
    const channel = supabase
      .channel(`chat-${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'listing_messages',
        filter: `chat_id=eq.${chatId}`,
      }, () => { fetchChat() })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [chatId])

  const fetchChat = async () => {
    setLoading(true)
    const res = await fetch(`/api/listing-chat?listingId=${listingId}&listingType=${listingType}`)
    const data = await res.json()
    setChatId(data.chat?.id)
    setMessages(data.messages || [])
    setMemberCount(data.memberCount || 0)
    setCurrentUserId(data.currentUserId || '')
    setLoading(false)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return
    setSending(true)
    await fetch('/api/listing-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, body: newMessage.trim() }),
    })
    setNewMessage('')
    fetchChat()
    setSending(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
      <div className="bg-white w-full sm:w-[480px] sm:rounded-2xl overflow-hidden flex flex-col" style={{ height: '85vh', maxHeight: '600px' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center text-sm">
                {listingType === 'subscription' ? '📦' : '✈️'}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{listingName}</p>
                <p className="text-xs text-gray-400">{memberCount} {memberCount === 1 ? 'member' : 'members'} in this group</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
          {!session ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <p className="text-4xl mb-3">💬</p>
                <p className="font-semibold text-gray-900 mb-2">Join the conversation</p>
                <p className="text-sm text-gray-500 mb-4">Sign in to chat with people interested in this listing</p>
                <button onClick={() => signIn('google')} className="btn-primary text-sm">
                  Sign in to chat
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400 text-sm">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <p className="text-4xl mb-3">👋</p>
                <p className="font-semibold text-gray-900 mb-1">Be the first to say hello!</p>
                <p className="text-xs text-gray-400">Ask questions about this listing</p>
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.user_id === currentUserId ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {msg.users?.image ? (
                  <Image
                    src={msg.users.image}
                    alt={msg.users.name}
                    width={28}
                    height={28}
                    className="rounded-full shrink-0 self-end"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-medium flex items-center justify-center shrink-0 self-end">
                    {getInitials(msg.users?.name || 'U')}
                  </div>
                )}

                <div className={`max-w-[75%] ${msg.user_id === currentUserId ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                  {msg.user_id !== currentUserId && (
                    <p className="text-xs text-gray-400 ml-1">{msg.users?.name}</p>
                  )}
                  <div className={`px-3 py-2 rounded-2xl text-sm ${
                    msg.user_id === currentUserId
                      ? 'bg-brand text-white rounded-br-sm'
                      : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.body}
                  </div>
                  <p className="text-[10px] text-gray-400 mx-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {session && (
          <div className="p-3 border-t border-gray-100 bg-white shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                className="input flex-1 text-sm"
                placeholder="Ask a question or say hi..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="btn-primary px-3 shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 text-center">
              This is a public group — all members can see messages
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
