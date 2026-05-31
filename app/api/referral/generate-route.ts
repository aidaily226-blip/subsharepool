import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET — get or create referral code for logged in user
export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user
  const { data: user } = await supabase
    .from('users')
    .select('id, ref_code, suspended')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.suspended) return NextResponse.json({ error: 'Account suspended' }, { status: 403 })

  // If user already has a ref code return it
  if (user.ref_code) {
    const { data: referral } = await supabase
      .from('referrals')
      .select('*')
      .eq('ref_code', user.ref_code)
      .single()
    return NextResponse.json({ ref_code: user.ref_code, stats: referral })
  }

  // Generate new unique ref code
  const ref_code = `${session.user.name?.toLowerCase().replace(/\s/g, '').slice(0, 6)}${Math.random().toString(36).slice(2, 6)}`

  // Save to referrals table
  await supabase.from('referrals').insert({
    referrer_id: user.id,
    ref_code,
  })

  // Save ref_code to user
  await supabase.from('users').update({ ref_code }).eq('id', user.id)

  return NextResponse.json({ ref_code, stats: { total_earned: 0, total_referrals: 0, total_listings: 0 } })
}
