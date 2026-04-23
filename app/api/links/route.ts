import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'

async function getOrCreateUser(email: string, name?: string | null, image?: string | null) {
  let { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (!user) {
    const { data: newUser } = await supabaseAdmin
      .from('users')
      .insert({ email, name, image })
      .select('id')
      .single()
    user = newUser
  }
  return user
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabaseAdmin
    .from('links')
    .select('*, users(id, name, image)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ data, count, page, limit })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, handle, type, description, url, stat } = body

  if (!name || !url) {
    return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 })
  }

  const user = await getOrCreateUser(session.user.email, session.user.name, session.user.image)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data, error } = await supabaseAdmin
    .from('links')
    .insert({ user_id: user.id, name, handle, type, description, url, stat })
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}