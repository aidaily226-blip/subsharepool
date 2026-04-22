import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: user } = await supabaseAdmin
    .from('users').select('*').eq('email', session.user.email).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const [subs, trips, links, feed] = await Promise.all([
    supabaseAdmin.from('subscriptions').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabaseAdmin.from('trips').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabaseAdmin.from('links').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabaseAdmin.from('feed_posts').select('id', { count: 'exact' }).eq('user_id', user.id),
  ])

  return NextResponse.json({
    user,
    stats: {
      subscriptions: subs.count || 0,
      trips: trips.count || 0,
      links: links.count || 0,
      feed_posts: feed.count || 0,
    }
  })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name } = await req.json()
  const { error } = await supabaseAdmin.from('users').update({ name }).eq('email', session.user.email)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: user } = await supabaseAdmin.from('users').select('id').eq('email', session.user.email).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const { error } = await supabaseAdmin.from('users').delete().eq('id', user.id)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}
