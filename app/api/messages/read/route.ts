import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { senderId } = await req.json()

  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('email', session.user.email).single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await supabaseAdmin
    .from('messages')
    .update({ read: true })
    .eq('receiver_id', user.id)
    .eq('sender_id', senderId)

  return NextResponse.json({ success: true })
}