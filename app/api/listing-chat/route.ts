import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const listingId = searchParams.get('listingId')
  const listingType = searchParams.get('listingType') || 'subscription'

  if (!listingId) return NextResponse.json({ error: 'Missing listingId' }, { status: 400 })

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Get or create chat
  let { data: chat } = await supabaseAdmin
    .from('listing_chats')
    .select('*')
    .eq('listing_id', listingId)
    .single()

  if (!chat) {
    const { data: newChat } = await supabaseAdmin
      .from('listing_chats')
      .insert({ listing_id: listingId, listing_type: listingType })
      .select()
      .single()
    chat = newChat
  }

  if (!chat) return NextResponse.json({ error: 'Could not create chat' }, { status: 500 })

  // Add member if not exists
  const { data: existing } = await supabaseAdmin
    .from('listing_chat_members')
    .select('id')
    .eq('chat_id', chat.id)
    .eq('user_id', user.id)
    .single()

  if (!existing) {
    await supabaseAdmin.from('listing_chat_members').insert({
      chat_id: chat.id,
      user_id: user.id,
    })
  }

  // Get messages
  const { data: messages } = await supabaseAdmin
    .from('listing_messages')
    .select('*, users:user_id(id, name, image)')
    .eq('chat_id', chat.id)
    .order('created_at', { ascending: true })

  // Get member count
  const { count } = await supabaseAdmin
    .from('listing_chat_members')
    .select('*', { count: 'exact', head: true })
    .eq('chat_id', chat.id)

  return NextResponse.json({
    chat,
    messages: messages || [],
    memberCount: count || 0,
    currentUserId: user.id,
  })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { chatId, body } = await req.json()
  if (!chatId || !body?.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data, error } = await supabaseAdmin
    .from('listing_messages')
    .insert({ chat_id: chatId, user_id: user.id, body: body.trim() })
    .select('*, users:user_id(id, name, image)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
