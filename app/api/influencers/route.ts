import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// Public: anyone can browse creators
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('influencers')
    .select('*, users(id, name, image)')
    .order('followers', { ascending: false })
    .limit(100)
  if (error) return NextResponse.json([])
  return NextResponse.json(data || [])
}

// One creator profile per user. Posting again updates it.
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Please sign in to add your profile' }, { status: 401 })
  }

  const b = await req.json()
  if (!b.display_name || !b.platform || !b.niche || !b.link) {
    return NextResponse.json({ error: 'Name, platform, niche and link are required' }, { status: 400 })
  }
  const link = String(b.link).trim()
  if (!/^https?:\/\//i.test(link)) {
    return NextResponse.json({ error: 'Link must start with http:// or https://' }, { status: 400 })
  }

  const { data: user } = await supabaseAdmin
    .from('users').select('id, suspended').eq('email', session.user.email).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.suspended) return NextResponse.json({ error: 'Account suspended' }, { status: 403 })

  const followers = Math.max(0, parseInt(b.followers) || 0)
  const { data, error } = await supabaseAdmin
    .from('influencers')
    .upsert({
      user_id: user.id,
      display_name: String(b.display_name).trim().slice(0, 60),
      handle: b.handle ? String(b.handle).trim().slice(0, 60) : null,
      platform: b.platform,
      niche: String(b.niche).trim().slice(0, 40),
      followers,
      link,
      bio: b.bio ? String(b.bio).trim().slice(0, 240) : null,
      open_to: Array.isArray(b.open_to) ? b.open_to : [],
    }, { onConflict: 'user_id' })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
