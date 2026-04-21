import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''

  if (!q) return NextResponse.json([])

  const results: object[] = []

  // Search subscriptions
  const { data: subs } = await supabaseAdmin
    .from('subscriptions')
    .select('id, name, description, category, users(id, name)')
    .ilike('name', `%${q}%`)
    .limit(5)

  if (subs) {
    subs.forEach((s: any) => {
      results.push({
        id: s.id,
        type: 'subscription',
        title: s.name,
        subtitle: s.description || s.category,
        badge: s.category,
        userId: s.users?.id,
      })
    })
  }

  // Search trips
  const { data: trips } = await supabaseAdmin
    .from('trips')
    .select('id, title, from_location, to_location, type, users(id, name)')
    .ilike('title', `%${q}%`)
    .limit(5)

  if (trips) {
    trips.forEach((t: any) => {
      results.push({
        id: t.id,
        type: 'trip',
        title: t.title,
        subtitle: `${t.from_location} → ${t.to_location}`,
        badge: t.type,
        userId: t.users?.id,
      })
    })
  }

  // Search links
  const { data: links } = await supabaseAdmin
    .from('links')
    .select('id, name, description, type, users(id, name)')
    .ilike('name', `%${q}%`)
    .limit(5)

  if (links) {
    links.forEach((l: any) => {
      results.push({
        id: l.id,
        type: 'link',
        title: l.name,
        subtitle: l.description || l.type,
        badge: l.type,
        userId: l.users?.id,
      })
    })
  }

  // Search feed
  const { data: feed } = await supabaseAdmin
    .from('feed_posts')
    .select('id, body, tag, users(id, name)')
    .ilike('body', `%${q}%`)
    .limit(5)

  if (feed) {
    feed.forEach((f: any) => {
      results.push({
        id: f.id,
        type: 'feed',
        title: f.body.substring(0, 60) + (f.body.length > 60 ? '...' : ''),
        subtitle: `Posted by ${f.users?.name}`,
        badge: f.tag,
        userId: f.users?.id,
      })
    })
  }

  return NextResponse.json(results)
}