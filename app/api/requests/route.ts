import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// Public: anyone can read open requests, no login needed
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('requests')
    .select('id, service, max_price, currency, note, city, created_at, user_id, users(name, image)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(60)

  if (error) return NextResponse.json([])

  // Only expose first name + avatar, never email
  const safe = (data || []).map((r: any) => ({
    id: r.id,
    service: r.service,
    max_price: r.max_price,
    currency: r.currency,
    note: r.note,
    city: r.city,
    created_at: r.created_at,
    users: {
      id: r.user_id,
      name: (r.users?.name || 'Someone').split(' ')[0],
      image: r.users?.image || null,
    },
  }))
  return NextResponse.json(safe)
}

// Login required to post
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Please sign in to post a request' }, { status: 401 })
  }

  const { service, max_price, currency, note, city } = await req.json()
  if (!service || !String(service).trim()) {
    return NextResponse.json({ error: 'Tell us what you want to split' }, { status: 400 })
  }

  const { data: user } = await supabaseAdmin
    .from('users').select('id, suspended').eq('email', session.user.email).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.suspended) return NextResponse.json({ error: 'Account suspended' }, { status: 403 })

  // Spam guard: 5 requests per user per day
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await supabaseAdmin
    .from('requests').select('*', { count: 'exact', head: true })
    .eq('user_id', user.id).gte('created_at', since)
  if ((count || 0) >= 5) {
    return NextResponse.json({ error: 'You can post 5 requests per day' }, { status: 429 })
  }

  const price = parseFloat(max_price)
  const { data, error } = await supabaseAdmin
    .from('requests')
    .insert({
      user_id: user.id,
      service: String(service).trim().slice(0, 80),
      max_price: Number.isFinite(price) ? price : null,
      currency: currency || 'INR',
      note: note ? String(note).trim().slice(0, 300) : null,
      city: city ? String(city).trim().slice(0, 60) : null,
    })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
