import { NextRequest, NextResponse } from 'next/server'
import { getRecommendedPosts } from '@/lib/api'

interface RequestData {
  params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: RequestData) {
  const { slug } = await params
  const recommendedPosts = await getRecommendedPosts(slug)

  console.log(
    `Retrieved recommended posts for "${slug}" (pages API)`,
    recommendedPosts.map((p) => p.slug),
  )

  return NextResponse.json({ posts: recommendedPosts })
}
