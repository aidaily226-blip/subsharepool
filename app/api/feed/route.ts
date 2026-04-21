import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'

async function getOrCreateUser(email: string, name?: string | null, image?: string | null) {
  let { data: user } = await supabaseAdmin
    .from('users').select('id').eq('email', email).single()
  if (!user) {
    const { data: newUser } = await supabaseAdmin
      .from('users').insert({ email, name, image }).select('id').single()
    user = newUser
  }
  return user
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tag = searchParams.get('tag')

  let query = supabaseAdmin
    .from('feed_posts')
    .select('*, users(id, name, image)')
    .order('created_at', { ascending: false })

  if (tag && tag !== 'all') {
    query = query.eq('tag', tag)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { body: postBody, tag, link_title, link_url, link_icon } = body

  if (!postBody) return NextResponse.json({ error: 'Body is required' }, { status: 400 })

  const user = await getOrCreateUser(session.user.email, session.user.name, session.user.image)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data, error } = await supabaseAdmin
    .from('feed_posts')
    .insert({
      user_id: user.id,
      body: postBody,
      tag: tag || 'idea',
      likes: 0,
      link_title,
      link_url,
      link_icon,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
