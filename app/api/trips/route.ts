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
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  let query = supabaseAdmin
    .from('trips')
    .select('*, users(id, name, image)')
    .order('created_at', { ascending: false })

  if (type && type !== 'all') {
    query = query.eq('type', type)
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
  const { title, type, from_location, to_location, date, total_seats, price, description, vehicle } = body

  if (!title || !from_location || !to_location || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const user = await getOrCreateUser(session.user.email, session.user.name, session.user.image)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data, error } = await supabaseAdmin
    .from('trips')
    .insert({
      user_id: user.id,
      title,
      type: type || 'carpool',
      from_location,
      to_location,
      date,
      total_seats: total_seats || 2,
      filled_seats: 0,
      price,
      description,
      vehicle,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}