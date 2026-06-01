import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, suspended')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: earnings } = await supabaseAdmin
    .from('referral_earnings')
    .select('*')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })

  const { data: withdrawals } = await supabaseAdmin
    .from('referral_withdrawals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const totalPending = earnings?.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0) || 0
  const totalApproved = earnings?.filter(e => ['approved','paid'].includes(e.status)).reduce((s, e) => s + e.amount, 0) || 0
  const totalWithdrawn = withdrawals?.filter(w => w.status === 'paid').reduce((s, w) => s + w.amount, 0) || 0
  const availableBalance = totalApproved - totalWithdrawn

  return NextResponse.json({
    earnings: earnings || [],
    withdrawals: withdrawals || [],
    summary: { totalPending, totalApproved, totalWithdrawn, availableBalance }
  })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { upi_id } = await req.json()
  if (!upi_id) return NextResponse.json({ error: 'UPI ID required' }, { status: 400 })

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, suspended')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.suspended) return NextResponse.json({ error: 'Account suspended' }, { status: 403 })

  const { data: earnings } = await supabaseAdmin
    .from('referral_earnings')
    .select('amount, status')
    .eq('referrer_id', user.id)
    .in('status', ['approved', 'paid'])

  const { data: withdrawals } = await supabaseAdmin
    .from('referral_withdrawals')
    .select('amount, status')
    .eq('user_id', user.id)
    .eq('status', 'paid')

  const totalApproved = earnings?.reduce((s, e) => s + e.amount, 0) || 0
  const totalWithdrawn = withdrawals?.reduce((s, w) => s + w.amount, 0) || 0
  const availableBalance = totalApproved - totalWithdrawn

  if (availableBalance < 20) {
    return NextResponse.json({ error: `Minimum withdrawal is ₹20. Your balance is ₹${availableBalance}` }, { status: 400 })
  }

  const { data: pending } = await supabaseAdmin
    .from('referral_withdrawals')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'requested')
    .single()

  if (pending) return NextResponse.json({ error: 'You already have a pending withdrawal' }, { status: 400 })

  await supabaseAdmin.from('referral_withdrawals').insert({
    user_id: user.id,
    amount: availableBalance,
    upi_id,
    status: 'requested',
  })

  return NextResponse.json({ ok: true, amount: availableBalance })
}
