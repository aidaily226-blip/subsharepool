import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET — get earnings for logged in user
export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, ref_code, suspended')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Get all earnings
  const { data: earnings } = await supabase
    .from('referral_earnings')
    .select('*')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })

  // Get withdrawal history
  const { data: withdrawals } = await supabase
    .from('referral_withdrawals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Get referral stats
  const { data: referral } = await supabase
    .from('referrals')
    .select('*')
    .eq('ref_code', user.ref_code)
    .single()

  // Calculate totals
  const totalPending = earnings
    ?.filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0) || 0

  const totalApproved = earnings
    ?.filter(e => e.status === 'approved' || e.status === 'paid')
    .reduce((sum, e) => sum + e.amount, 0) || 0

  const totalWithdrawn = withdrawals
    ?.filter(w => w.status === 'paid')
    .reduce((sum, w) => sum + w.amount, 0) || 0

  const availableBalance = totalApproved - totalWithdrawn

  return NextResponse.json({
    earnings: earnings || [],
    withdrawals: withdrawals || [],
    stats: referral || {},
    summary: {
      totalPending,
      totalApproved,
      totalWithdrawn,
      availableBalance,
    }
  })
}

// POST — request withdrawal
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { upi_id } = await req.json()
  if (!upi_id) return NextResponse.json({ error: 'UPI ID required' }, { status: 400 })

  const { data: user } = await supabase
    .from('users')
    .select('id, suspended')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.suspended) return NextResponse.json({ error: 'Account suspended' }, { status: 403 })

  // Get min withdrawal amount
  const { data: minSetting } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_min_withdrawal')
    .single()

  const minWithdrawal = parseFloat(minSetting?.value || '20')

  // Calculate available balance
  const { data: earnings } = await supabase
    .from('referral_earnings')
    .select('amount, status')
    .eq('referrer_id', user.id)
    .in('status', ['approved', 'paid'])

  const { data: withdrawals } = await supabase
    .from('referral_withdrawals')
    .select('amount, status')
    .eq('user_id', user.id)
    .eq('status', 'paid')

  const totalApproved = earnings?.reduce((sum, e) => sum + e.amount, 0) || 0
  const totalWithdrawn = withdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0
  const availableBalance = totalApproved - totalWithdrawn

  if (availableBalance < minWithdrawal) {
    return NextResponse.json({
      error: `Minimum withdrawal is ₹${minWithdrawal}. Your balance is ₹${availableBalance}`
    }, { status: 400 })
  }

  // Check no pending withdrawal
  const { data: pendingWithdrawal } = await supabase
    .from('referral_withdrawals')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'requested')
    .single()

  if (pendingWithdrawal) {
    return NextResponse.json({ error: 'You already have a pending withdrawal request' }, { status: 400 })
  }

  // Create withdrawal request
  await supabase.from('referral_withdrawals').insert({
    user_id: user.id,
    amount: availableBalance,
    upi_id,
    status: 'requested',
  })

  console.log(`Withdrawal request: user=${user.id}, amount=₹${availableBalance}, upi=${upi_id}`)

  return NextResponse.json({ ok: true, amount: availableBalance })
}
