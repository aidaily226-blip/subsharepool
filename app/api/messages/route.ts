import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET — fetch all conversations OR messages with specific user
export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const otherUserId = searchParams.get('userId')

  // If userId provided — fetch messages between two users
  if (otherUserId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:sender_id(id, name, image, email), receiver:receiver_id(id, name, image, email)')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUser.id})`)
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json([], { status: 200 })
    return NextResponse.json(data || [])
  }

  // Otherwise — fetch all messages for conversations list
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:sender_id(id, name, image, email), receiver:receiver_id(id, name, image, email)')
    .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ data: [], currentUserId: currentUser.id })
  return NextResponse.json({ data: data || [], currentUserId: currentUser.id })
}

// POST — send a message
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { receiver_id, body } = await req.json()
  if (!receiver_id || !body?.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: currentUser.id,
      receiver_id,
      body: body.trim(),
      read: false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
