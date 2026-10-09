import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET — fetch messages for a specific group chat
export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const chatId = searchParams.get('chatId')

  if (!chatId) return NextResponse.json({ error: 'Missing chatId' }, { status: 400 })

  const { data: messages } = await supabaseAdmin
    .from('listing_messages')
    .select('*, users:user_id(id, name, image)')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })

  const { count } = await supabaseAdmin
    .from('listing_chat_members')
    .select('*', { count: 'exact', head: true })
    .eq('chat_id', chatId)

  return NextResponse.json({
    messages: messages || [],
    memberCount: count || 0,
  })
}
