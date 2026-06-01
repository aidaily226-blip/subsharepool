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
    .select('id, ref_code, suspended')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.suspended) return NextResponse.json({ error: 'Account suspended' }, { status: 403 })

  // If user already has ref_code return it with stats
  if (user.ref_code) {
    const { data: referral } = await supabaseAdmin
      .from('referrals')
      .select('*')
      .eq('ref_code', user.ref_code)
      .single()
    return NextResponse.json({ ref_code: user.ref_code, stats: referral || {} })
  }

  // Generate new unique ref code
  const namePart = (session.user.name || 'user')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 6)
  const randomPart = Math.random().toString(36).slice(2, 6)
  const ref_code = `${namePart}${randomPart}`

  // Save to referrals table
  await supabaseAdmin.from('referrals').insert({
    referrer_id: user.id,
    ref_code,
    total_earned: 0,
    total_referrals: 0,
    total_listings: 0,
  })

  // Save ref_code to user
  await supabaseAdmin
    .from('users')
    .update({ ref_code })
    .eq('id', user.id)

  return NextResponse.json({
    ref_code,
    stats: { total_earned: 0, total_referrals: 0, total_listings: 0 }
  })
}
