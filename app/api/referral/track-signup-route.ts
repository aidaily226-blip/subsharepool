import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST — called after new user signs up
// Body: { userId, ref_code, country, ip }
export async function POST(req: Request) {
  const { userId, ref_code, country, ip } = await req.json()

  if (!userId || !ref_code) return NextResponse.json({ ok: false })

  // Check if program is enabled
  const { data: setting } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_program_enabled')
    .single()

  if (setting?.value !== 'true') return NextResponse.json({ ok: false, reason: 'Program disabled' })

  // Check India only
  const { data: indiaOnly } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_india_only')
    .single()

  if (indiaOnly?.value === 'true' && country !== 'IN') {
    return NextResponse.json({ ok: false, reason: 'India only' })
  }

  // Get referrer from ref_code
  const { data: referral } = await supabase
    .from('referrals')
    .select('*, users(id, email, suspended)')
    .eq('ref_code', ref_code)
    .single()

  if (!referral) return NextResponse.json({ ok: false, reason: 'Invalid ref code' })
  if (referral.users?.suspended) return NextResponse.json({ ok: false, reason: 'Referrer suspended' })

  // Check referrer is not referring themselves
  if (referral.referrer_id === userId) {
    return NextResponse.json({ ok: false, reason: 'Self referral not allowed' })
  }

  // Check same IP fraud
  const { data: sameIPUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', referral.referrer_id)
    .single()

  // Check monthly cap (max 10 referrals per month)
  const { data: capSetting } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_max_per_month')
    .single()

  const cap = parseInt(capSetting?.value || '10')
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('referral_earnings')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_id', referral.referrer_id)
    .eq('earning_type', 'signup')
    .gte('created_at', startOfMonth.toISOString())

  if ((count || 0) >= cap) {
    return NextResponse.json({ ok: false, reason: 'Monthly cap reached' })
  }

  // Get signup amount
  const { data: amountSetting } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_signup_amount')
    .single()

  const amount = parseFloat(amountSetting?.value || '1')

  // Save referred_by and country to new user
  await supabase
    .from('users')
    .update({ referred_by: ref_code, country })
    .eq('id', userId)

  // Record earning
  await supabase.from('referral_earnings').insert({
    referrer_id: referral.referrer_id,
    referred_user_id: userId,
    earning_type: 'signup',
    amount,
    status: 'pending',
  })

  // Update referral stats
  await supabase
    .from('referrals')
    .update({
      total_referrals: (referral.total_referrals || 0) + 1,
      total_earned: (referral.total_earned || 0) + amount,
    })
    .eq('ref_code', ref_code)

  // Send email notification to admin
  console.log(`New referral signup: ref=${ref_code}, user=${userId}, amount=₹${amount}`)

  return NextResponse.json({ ok: true, earned: amount })
}
