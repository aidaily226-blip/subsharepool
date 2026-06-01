import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

async function isAdmin(email: string) {
  const { data } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('email', email)
    .single()
  return data?.role === 'admin'
}

// GET — fetch all earnings and withdrawals
export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!await isAdmin(session.user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: withdrawals } = await supabaseAdmin
    .from('referral_withdrawals')
    .select('*, users(name, email, country)')
    .order('created_at', { ascending: false })

  const { data: earnings } = await supabaseAdmin
    .from('referral_earnings')
    .select('*, users:referrer_id(name, email)')
    .order('created_at', { ascending: false })

  return NextResponse.json({
    withdrawals: withdrawals || [],
    earnings: earnings || [],
  })
}

// POST — approve/reject earnings, mark withdrawal paid
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!await isAdmin(session.user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { action, id, userId } = await req.json()

  if (action === 'approve_earning') {
    await supabaseAdmin
      .from('referral_earnings')
      .update({ status: 'approved' })
      .eq('id', id)
    return NextResponse.json({ ok: true })
  }

  if (action === 'reject_earning') {
    await supabaseAdmin
      .from('referral_earnings')
      .update({ status: 'cancelled' })
      .eq('id', id)
    return NextResponse.json({ ok: true })
  }

  if (action === 'mark_paid') {
    // Mark withdrawal as paid
    await supabaseAdmin
      .from('referral_withdrawals')
      .update({ status: 'paid' })
      .eq('id', id)

    // Mark all approved earnings as paid for this user
    await supabaseAdmin
      .from('referral_earnings')
      .update({ status: 'paid' })
      .eq('referrer_id', userId)
      .eq('status', 'approved')

    return NextResponse.json({ ok: true })
  }

  if (action === 'reject_withdrawal') {
    await supabaseAdmin
      .from('referral_withdrawals')
      .update({ status: 'rejected' })
      .eq('id', id)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
