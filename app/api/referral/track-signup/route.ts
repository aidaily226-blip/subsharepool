import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const { userId, ref_code, country } = await req.json()
  if (!userId || !ref_code) return NextResponse.json({ ok: false })

  // Check program enabled
  const { data: setting } = await supabaseAdmin
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_program_enabled')
    .single()
  if (setting?.value !== 'true') return NextResponse.json({ ok: false })

  // Check India only
  const { data: indiaOnly } = await supabaseAdmin
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_india_only')
    .single()
  if (indiaOnly?.value === 'true' && country !== 'IN') {
    return NextResponse.json({ ok: false, reason: 'India only' })
  }

  // Get referrer
  const { data: referral } = await supabaseAdmin
    .from('referrals')
    .select('*')
    .eq('ref_code', ref_code)
    .single()
  if (!referral) return NextResponse.json({ ok: false, reason: 'Invalid ref code' })

  // No self referral
  if (referral.referrer_id === userId) {
    return NextResponse.json({ ok: false, reason: 'Self referral not allowed' })
  }

  // Check monthly cap
  const { data: capSetting } = await supabaseAdmin
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_max_per_month')
    .single()
  const cap = parseInt(capSetting?.value || '10')
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  const { count } = await supabaseAdmin
    .from('referral_earnings')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_id', referral.referrer_id)
    .eq('earning_type', 'signup')
    .gte('created_at', startOfMonth.toISOString())
  if ((count || 0) >= cap) return NextResponse.json({ ok: false, reason: 'Cap reached' })

  const amount = 1

  // Save referred_by to new user
  await supabaseAdmin
    .from('users')
    .update({ referred_by: ref_code, country })
    .eq('id', userId)

  // Record earning
  await supabaseAdmin.from('referral_earnings').insert({
    referrer_id: referral.referrer_id,
    referred_user_id: userId,
    earning_type: 'signup',
    amount,
    status: 'pending',
  })

  // Update stats
  await supabaseAdmin
    .from('referrals')
    .update({
      total_referrals: (referral.total_referrals || 0) + 1,
      total_earned: (referral.total_earned || 0) + amount,
    })
    .eq('ref_code', ref_code)

  return NextResponse.json({ ok: true, earned: amount })
}
