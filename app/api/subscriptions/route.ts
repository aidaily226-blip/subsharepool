import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*, users(name, image)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
const session = await auth()
if (!session?.user?.email) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

  const body = await req.json()
  const { name, description, price, total_slots, category } = body

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  // Get user id
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email!)
    .single()

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      user_id: user.id,
      name,
      description,
      price,
      total_slots: total_slots || 2,
      category: category || 'other',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}