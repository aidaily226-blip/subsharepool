import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data: post } = await supabaseAdmin
    .from('feed_posts')
    .select('likes')
    .eq('id', id)
    .single()

  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const { data, error } = await supabaseAdmin
    .from('feed_posts')
    .update({ likes: (post.likes || 0) + 1 })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
