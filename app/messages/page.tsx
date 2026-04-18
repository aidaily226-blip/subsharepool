'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { getInitials } from '@/lib/utils'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface User {
  id: string
  name: string
  image: string
  email: string
}

interface Message {
  id: string
  body: string
  sender_id: string
  receiver_id: string
  created_at: string
  sender: User
  receiver: User
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const [conversations, setConversations] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'authenticated') fetchConversations()
  }, [status])

  useEffect(() => {
    if (status === 'authenticated' && currentUserId) {
      const urlParams = new URLSearchParams(window.location.search)
      const userId = urlParams.get('userId')
      if (userId) fetchUserAndSelect(userId)
    }
  }, [status, currentUserId])

  useEffect(() => {
    if (selectedUser && currentUserId) {
      fetchMessages()
      const cleanup = subscribeToMessages()
      return cleanup
    }
  }, [selectedUser])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

const fetchUserAndSelect = async (userId: string) => {
  const res = await fetch(`/api/get-user?userId=${userId}`)
  const data = await res.json()
  if (data?.id) setSelectedUser(data)
}

  const fetchConversations = async () => {
    setLoading(true)
    const res = await fetch('/api/messages')
    const { data, currentUserId: uid } = await res.json()
    setCurrentUserId(uid)

    if (data) {
      const seen = new Set<string>()
      const convUsers: User[] = []
      data.forEach((msg: Message) => {
        const other = msg.sender_id === uid ? msg.receiver : msg.sender
        if (other && !seen.has(other.id)) {
          seen.add(other.id)
          convUsers.push(other)
        }
      })
      setConversations(convUsers)
    }
    setLoading(false)
  }

  const fetchMessages = async () => {
    if (!selectedUser) return
    const res = await fetch(`/api/messages?userId=${selectedUser.id}`)
    const data = await res.json()
    setMessages(Array.isArray(data) ? data : [])
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const msg = payload.new as Message
        if (
          (msg.sender_id === currentUserId && msg.receiver_id === selectedUser?.id) ||
          (msg.sender_id === selectedUser?.id && msg.receiver_id === currentUserId)
        ) {
          fetchMessages()
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return
    setSending(true)

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receiver_id: selectedUser.id,
        body: newMessage.trim(),
      }),
    })

    if (res.ok) {
      setNewMessage('')
      fetchMessages()
    }
    setSending(false)
  }

  if (status === 'loading') return (
    <div className="text-center py-16 text-gray-400">Loading...</div>
  )

  if (!session) return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">Please sign in to view messages</p>
      <button onClick={() => signIn('google')} className="btn-primary">
        Sign in with Google
      </button>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex" style={{ height: '70vh' }}>

        {/* Conversations sidebar */}
        <div className="w-72 border-r border-gray-100 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                No conversations yet.
                <br />Start by messaging someone!
              </div>
            ) : (
              conversations.map(user => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left ${selectedUser?.id === user.id ? 'bg-brand-light' : ''}`}
                >
                  {user.image ? (
                    <Image src={user.image} alt={user.name} width={40} height={40} className="rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand text-white text-sm font-medium flex items-center justify-center">
                      {getInitials(user.name || 'U')}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-3 border-b border-gray-100 flex items-center gap-3">
                {selectedUser.image ? (
                  <Image src={selectedUser.image} alt={selectedUser.name} width={36} height={36} className="rounded-full" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand text-white text-sm font-medium flex items-center justify-center">
                    {getInitials(selectedUser.name || 'U')}
                  </div>
                )}
                <p className="font-medium text-gray-900">{selectedUser.name}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm mt-8">
                    No messages yet. Say hello! 👋
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                          msg.sender_id === currentUserId
                            ? 'bg-brand text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                        }`}
                      >
                        {msg.body}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="btn-primary px-4"
                >
                  {sending ? '...' : 'Send'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-4xl mb-3">💬</p>
                <p className="font-medium">Select a conversation</p>
                <p className="text-sm mt-1">or start a new one from a listing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}