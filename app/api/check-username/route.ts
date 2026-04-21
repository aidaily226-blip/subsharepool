import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')

  if (!username || username.length < 3) {
    return NextResponse.json({ available: false })
  }

  const { data } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('username', username)
    .single()

  return NextResponse.json({ available: !data })
}