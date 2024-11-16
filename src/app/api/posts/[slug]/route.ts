import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/api'

interface RequestData {
  params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: RequestData) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return new NextResponse(null, { status: 404 })
  }

  console.log('Retrieved post (API)', post.slug)

  return NextResponse.json({ post })
}
