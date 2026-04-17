import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'

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

  // ✅ Get or create user
  let { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!user) {
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      })
      .select('id')
      .single()

    if (createError) {
      return NextResponse.json({ error: createError }, { status: 500 })
    }

    user = newUser
  }

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // ✅ Create subscription
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