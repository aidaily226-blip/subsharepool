import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await supabaseAdmin.rpc('increment_interested', { row_id: id })

  return NextResponse.json({ ok: true })
}
