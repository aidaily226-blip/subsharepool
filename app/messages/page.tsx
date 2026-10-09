'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { getInitials } from '@/lib/utils'
import { ArrowLeft, Send } from 'lucide-react'

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
  read: boolean
  created_at: string
  sender: User
  receiver: User
}

interface GroupChat {
  id: string
  listing_id: string
  listing_type: string
  lastMsg?: string
  memberCount?: number
  listingName?: string
}

interface GroupMessage {
  id: string
  body: string
  user_id: string
  created_at: string
  users: User
}

interface Conversation {
  user: User
  lastMsg: string
  unread: number
}

type ActiveView = 'private' | 'group'

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const [activeView, setActiveView] = useState<ActiveView>('private')

  // Private chat state
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)

  // Group chat state
  const [groupChats, setGroupChats] = useState<GroupChat[]>([])
  const [selectedGroup, setSelectedGroup] = useState<GroupChat | null>(null)
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([])
  const [groupMemberCount, setGroupMemberCount] = useState(0)
  const [newGroupMessage, setNewGroupMessage] = useState('')
  const [sendingGroup, setSendingGroup] = useState(false)
  const [loadingGroups, setLoadingGroups] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const groupMessagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConversations()
      fetchGroupChats()
    }
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
      markAsRead(selectedUser.id)
      const cleanup = subscribeToMessages()
      return cleanup
    }
  }, [selectedUser])

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupMessages(selectedGroup.id)
      const cleanup = subscribeToGroupMessages(selectedGroup.id)
      return cleanup
    }
  }, [selectedGroup])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    groupMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [groupMessages])

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
      const seen = new Map<string, Conversation>()
      data.forEach((msg: Message) => {
        const other = msg.sender_id === uid ? msg.receiver : msg.sender
        if (!other) return
        if (!seen.has(other.id)) {
          seen.set(other.id, {
            user: other,
            lastMsg: msg.body,
            unread: msg.sender_id !== uid && !msg.read ? 1 : 0,
          })
        } else {
          const existing = seen.get(other.id)!
          if (msg.sender_id !== uid && !msg.read) existing.unread += 1
        }
      })
      setConversations(Array.from(seen.values()))
    }
    setLoading(false)
  }

  const fetchGroupChats = async () => {
    setLoadingGroups(true)
    const res = await fetch('/api/listing-chat/my-groups')
    const data = await res.json()
    setGroupChats(data || [])
    setLoadingGroups(false)
  }

  const fetchGroupMessages = async (chatId: string) => {
    const res = await fetch(`/api/listing-chat/messages?chatId=${chatId}`)
    const data = await res.json()
    setGroupMessages(data.messages || [])
    setGroupMemberCount(data.memberCount || 0)
  }

  const subscribeToGroupMessages = (chatId: string) => {
    const channel = supabase
      .channel(`group-${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'listing_messages',
        filter: `chat_id=eq.${chatId}`,
      }, () => fetchGroupMessages(chatId))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }

  const markAsRead = async (senderId: string) => {
    await fetch('/api/messages/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId }),
    })
    fetchConversations()
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
          markAsRead(selectedUser?.id || '')
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
      body: JSON.stringify({ receiver_id: selectedUser.id, body: newMessage.trim() }),
    })
    if (res.ok) {
      setNewMessage('')
      fetchMessages()
      fetchConversations()
    }
    setSending(false)
  }

  const sendGroupMessage = async () => {
    if (!newGroupMessage.trim() || !selectedGroup) return
    setSendingGroup(true)
    await fetch('/api/listing-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: selectedGroup.id, body: newGroupMessage.trim() }),
    })
    setNewGroupMessage('')
    fetchGroupMessages(selectedGroup.id)
    setSendingGroup(false)
  }

  if (status === 'loading') return <div className="text-center py-16 text-gray-400">Loading...</div>

  if (!session) return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">Please sign in to view messages</p>
      <button onClick={() => signIn('google')} className="btn-primary">Sign in with Google</button>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>

      {/* Toggle Private / Group */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setActiveView('private'); setSelectedGroup(null) }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeView === 'private' ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600'
          }`}
        >
          💬 Private Messages
          {conversations.some(c => c.unread > 0) && (
            <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {conversations.reduce((s, c) => s + c.unread, 0)}
            </span>
          )}
        </button>
        <button
          onClick={() => { setActiveView('group'); setSelectedUser(null) }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeView === 'group' ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600'
          }`}
        >
          👥 Group Chats
          {groupChats.length > 0 && (
            <span className="ml-2 bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
              {groupChats.length}
            </span>
          )}
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex" style={{ height: '72vh' }}>

        {/* ── PRIVATE MESSAGES ── */}
        {activeView === 'private' && (
          <>
            {/* Sidebar */}
            <div className={`border-r border-gray-100 flex flex-col ${selectedUser ? 'hidden sm:flex w-72' : 'flex w-full sm:w-72'}`}>
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-700">Private Conversations</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-400 text-sm">No conversations yet</div>
                ) : (
                  conversations.map(({ user, lastMsg, unread }) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user)
                        markAsRead(user.id)
                        setConversations(prev => prev.map(c => c.user.id === user.id ? { ...c, unread: 0 } : c))
                      }}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left ${selectedUser?.id === user.id ? 'bg-brand/5' : ''}`}
                    >
                      {user.image ? (
                        <Image src={user.image} alt={user.name} width={40} height={40} className="rounded-full shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-brand text-white text-sm font-medium flex items-center justify-center shrink-0">
                          {getInitials(user.name || 'U')}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm ${unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-900'}`}>{user.name}</p>
                          {unread > 0 && (
                            <span className="bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">{unread}</span>
                          )}
                        </div>
                        <p className={`text-xs truncate ${unread > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{lastMsg}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Private chat area */}
            <div className={`flex-1 flex-col ${selectedUser ? 'flex' : 'hidden sm:flex'}`}>
              {selectedUser ? (
                <>
                  <div className="p-3 border-b border-gray-100 flex items-center gap-3">
                    <button onClick={() => setSelectedUser(null)} className="sm:hidden mr-1 text-gray-400">
                      <ArrowLeft size={20} />
                    </button>
                    {selectedUser.image ? (
                      <Image src={selectedUser.image} alt={selectedUser.name} width={36} height={36} className="rounded-full" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-brand text-white text-sm font-medium flex items-center justify-center">
                        {getInitials(selectedUser.name || 'U')}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{selectedUser.name}</p>
                      <p className="text-xs text-gray-400">Private conversation</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm mt-8">No messages yet. Say hello! 👋</div>
                    ) : messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.sender_id === currentUserId ? 'bg-brand text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
                          {msg.body}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-3 border-t border-gray-100 flex gap-2">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage} disabled={sending || !newMessage.trim()} className="btn-primary px-4">
                      <Send size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="text-4xl mb-3">💬</p>
                    <p className="font-medium">Select a conversation</p>
                    <p className="text-sm mt-1">or start one from a listing</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── GROUP CHATS ── */}
        {activeView === 'group' && (
          <>
            {/* Group sidebar */}
            <div className={`border-r border-gray-100 flex flex-col ${selectedGroup ? 'hidden sm:flex w-72' : 'flex w-full sm:w-72'}`}>
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-700">Listing Group Chats</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loadingGroups ? (
                  <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
                ) : groupChats.length === 0 ? (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    <p className="text-2xl mb-2">👥</p>
                    <p>No group chats yet</p>
                    <p className="text-xs mt-1">Click Chat on a listing to join a group</p>
                  </div>
                ) : (
                  groupChats.map(group => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group)}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left ${selectedGroup?.id === group.id ? 'bg-brand/5' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-lg shrink-0">
                        {group.listing_type === 'subscription' ? '📦' : '✈️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{group.listingName || 'Group Chat'}</p>
                        <p className="text-xs text-gray-400 truncate">{group.lastMsg || 'No messages yet'}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Group chat area */}
            <div className={`flex-1 flex-col ${selectedGroup ? 'flex' : 'hidden sm:flex'}`}>
              {selectedGroup ? (
                <>
                  <div className="p-3 border-b border-gray-100 flex items-center gap-3">
                    <button onClick={() => setSelectedGroup(null)} className="sm:hidden mr-1 text-gray-400">
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-lg shrink-0">
                      {selectedGroup.listing_type === 'subscription' ? '📦' : '✈️'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{selectedGroup.listingName || 'Group Chat'}</p>
                      <p className="text-xs text-gray-400">{groupMemberCount} members · Public group</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
                    {groupMessages.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm mt-8">
                        <p className="text-3xl mb-2">👋</p>
                        <p>Be the first to say hello!</p>
                      </div>
                    ) : groupMessages.map(msg => (
                      <div key={msg.id} className={`flex gap-2 ${msg.user_id === currentUserId ? 'flex-row-reverse' : 'flex-row'}`}>
                        {msg.users?.image ? (
                          <Image src={msg.users.image} alt={msg.users.name} width={28} height={28} className="rounded-full shrink-0 self-end" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-medium flex items-center justify-center shrink-0 self-end">
                            {getInitials(msg.users?.name || 'U')}
                          </div>
                        )}
                        <div className={`max-w-[75%] flex flex-col gap-0.5 ${msg.user_id === currentUserId ? 'items-end' : 'items-start'}`}>
                          {msg.user_id !== currentUserId && (
                            <p className="text-xs text-gray-400 ml-1">{msg.users?.name}</p>
                          )}
                          <div className={`px-3 py-2 rounded-2xl text-sm ${msg.user_id === currentUserId ? 'bg-brand text-white rounded-br-sm' : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'}`}>
                            {msg.body}
                          </div>
                          <p className="text-[10px] text-gray-400 mx-1">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={groupMessagesEndRef} />
                  </div>

                  <div className="p-3 border-t border-gray-100 bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input flex-1 text-sm"
                        placeholder="Message the group..."
                        value={newGroupMessage}
                        onChange={e => setNewGroupMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendGroupMessage()}
                      />
                      <button onClick={sendGroupMessage} disabled={sendingGroup || !newGroupMessage.trim()} className="btn-primary px-3">
                        <Send size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-center">All group members can see these messages</p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="text-4xl mb-3">👥</p>
                    <p className="font-medium">Select a group chat</p>
                    <p className="text-sm mt-1">Click Chat on any listing to join</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
