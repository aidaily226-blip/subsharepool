import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST — called when user posts first listing
// Body: { userId, listingId, listingType }
export async function POST(req: Request) {
  const { userId, listingId, listingType } = await req.json()

  if (!userId || !listingId) return NextResponse.json({ ok: false })

  // Check if program enabled
  const { data: setting } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_program_enabled')
    .single()

  if (setting?.value !== 'true') return NextResponse.json({ ok: false })

  // Get user
  const { data: user } = await supabase
    .from('users')
    .select('id, referred_by, first_listing_posted, country, suspended')
    .eq('id', userId)
    .single()

  if (!user) return NextResponse.json({ ok: false })
  if (user.suspended) return NextResponse.json({ ok: false, reason: 'User suspended' })
  if (!user.referred_by) return NextResponse.json({ ok: false, reason: 'No referral' })
  if (user.first_listing_posted) return NextResponse.json({ ok: false, reason: 'Already earned for listing' })

  // Check India only
  const { data: indiaOnly } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_india_only')
    .single()

  if (indiaOnly?.value === 'true' && user.country !== 'IN') {
    return NextResponse.json({ ok: false, reason: 'India only' })
  }

  // Get referrer
  const { data: referral } = await supabase
    .from('referrals')
    .select('*, users(id, suspended)')
    .eq('ref_code', user.referred_by)
    .single()

  if (!referral) return NextResponse.json({ ok: false })
  if (referral.users?.suspended) return NextResponse.json({ ok: false })

  // Check monthly cap
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
    .eq('earning_type', 'first_listing')
    .gte('created_at', startOfMonth.toISOString())

  if ((count || 0) >= cap) {
    return NextResponse.json({ ok: false, reason: 'Monthly cap reached' })
  }

  // Get listing amount
  const { data: amountSetting } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_listing_amount')
    .single()

  const amount = parseFloat(amountSetting?.value || '1')

  // Record earning
  await supabase.from('referral_earnings').insert({
    referrer_id: referral.referrer_id,
    referred_user_id: userId,
    earning_type: 'first_listing',
    listing_id: listingId,
    listing_type: listingType,
    amount,
    status: 'pending',
  })

  // Mark user as having posted first listing
  await supabase
    .from('users')
    .update({ first_listing_posted: true })
    .eq('id', userId)

  // Update referral stats
  await supabase
    .from('referrals')
    .update({
      total_listings: (referral.total_listings || 0) + 1,
      total_earned: (referral.total_earned || 0) + amount,
    })
    .eq('ref_code', user.referred_by)

  console.log(`New listing earning: ref=${user.referred_by}, listing=${listingId}, amount=₹${amount}`)

  return NextResponse.json({ ok: true, earned: amount })
}
