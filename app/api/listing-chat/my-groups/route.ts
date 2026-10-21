import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json([], { status: 200 })
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!user) return NextResponse.json([])

    // Get all chats user is member of
    const { data: memberships } = await supabaseAdmin
      .from('listing_chat_members')
      .select('chat_id')
      .eq('user_id', user.id)

    if (!memberships || memberships.length === 0) return NextResponse.json([])

    const chatIds = memberships.map(m => m.chat_id)

    const { data: chats } = await supabaseAdmin
      .from('listing_chats')
      .select('*')
      .in('id', chatIds)

    if (!chats || chats.length === 0) return NextResponse.json([])

    const enriched = await Promise.all(chats.map(async (chat) => {
      const { data: lastMsgData } = await supabaseAdmin
        .from('listing_messages')
        .select('body')
        .eq('chat_id', chat.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const { count } = await supabaseAdmin
        .from('listing_chat_members')
        .select('*', { count: 'exact', head: true })
        .eq('chat_id', chat.id)

      let listingName = 'Group Chat'
      if (chat.listing_type === 'subscription') {
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('name')
          .eq('id', chat.listing_id)
          .maybeSingle()
        if (sub) listingName = sub.name
      } else if (chat.listing_type === 'trip') {
        const { data: trip } = await supabaseAdmin
          .from('trips')
          .select('title')
          .eq('id', chat.listing_id)
          .maybeSingle()
        if (trip) listingName = trip.title
      }

      return {
        ...chat,
        lastMsg: lastMsgData?.body || null,
        memberCount: count || 0,
        listingName,
      }
    }))

    return NextResponse.json(enriched)
  } catch (error) {
    console.error('my-groups error:', error)
    return NextResponse.json([])
  }
}
