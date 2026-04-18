import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'

async function getOrCreateUser(email: string, name?: string | null, image?: string | null) {
  let { data: user } = await supabaseAdmin
    .from('users')
    .select('id, name, image, email')
    .eq('email', email)
    .single()

  if (!user) {
    const { data: newUser } = await supabaseAdmin
      .from('users')
      .insert({ email, name, image })
      .select('id, name, image, email')
      .single()
    user = newUser
  }
  return user
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const otherUserId = searchParams.get('userId')

  const user = await getOrCreateUser(session.user.email, session.user.name, session.user.image)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (otherUserId) {
    // Get messages between two users
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*, sender:sender_id(id, name, image), receiver:receiver_id(id, name, image)')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data)
  }

  // Get all conversations
  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('*, sender:sender_id(id, name, image, email), receiver:receiver_id(id, name, image, email)')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ data, currentUserId: user.id })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { receiver_id, body: messageBody } = body

  if (!receiver_id || !messageBody) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const user = await getOrCreateUser(session.user.email, session.user.name, session.user.image)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data, error } = await supabaseAdmin
    .from('messages')
    .insert({
      sender_id: user.id,
      receiver_id,
      body: messageBody,
    })
    .select('*, sender:sender_id(id, name, image), receiver:receiver_id(id, name, image)')
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}