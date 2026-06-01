import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const { userId, listingId, listingType } = await req.json()
  if (!userId || !listingId) return NextResponse.json({ ok: false })

  // Check program enabled
  const { data: setting } = await supabaseAdmin
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_program_enabled')
    .single()
  if (setting?.value !== 'true') return NextResponse.json({ ok: false })

  // Get user
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, referred_by, first_listing_posted, country, suspended')
    .eq('id', userId)
    .single()

  if (!user) return NextResponse.json({ ok: false })
  if (user.suspended) return NextResponse.json({ ok: false })
  if (!user.referred_by) return NextResponse.json({ ok: false, reason: 'No referral' })
  if (user.first_listing_posted) return NextResponse.json({ ok: false, reason: 'Already earned' })

  // Check India only
  const { data: indiaOnly } = await supabaseAdmin
    .from('app_settings')
    .select('value')
    .eq('key', 'referral_india_only')
    .single()
  if (indiaOnly?.value === 'true' && user.country !== 'IN') {
    return NextResponse.json({ ok: false, reason: 'India only' })
  }

  // Get referrer
  const { data: referral } = await supabaseAdmin
    .from('referrals')
    .select('*')
    .eq('ref_code', user.referred_by)
    .single()
  if (!referral) return NextResponse.json({ ok: false })

  const amount = 1

  // Record earning
  await supabaseAdmin.from('referral_earnings').insert({
    referrer_id: referral.referrer_id,
    referred_user_id: userId,
    earning_type: 'first_listing',
    listing_id: listingId,
    listing_type: listingType,
    amount,
    status: 'pending',
  })

  // Mark first listing posted
  await supabaseAdmin
    .from('users')
    .update({ first_listing_posted: true })
    .eq('id', userId)

  // Update stats
  await supabaseAdmin
    .from('referrals')
    .update({
      total_listings: (referral.total_listings || 0) + 1,
      total_earned: (referral.total_earned || 0) + amount,
    })
    .eq('ref_code', user.referred_by)

  return NextResponse.json({ ok: true, earned: amount })
}
