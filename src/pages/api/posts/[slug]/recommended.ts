import type { NextApiRequest, NextApiResponse } from 'next'
import { getRecommendedPosts } from '@/lib/api'
import { Post } from '@/interfaces/post'

interface ResponseData {
  posts: Post[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  const slug = req.query.slug as string
  const recommendedPosts = await getRecommendedPosts(slug)

  console.log(
    `Retrieved recommended posts for "${slug}" (pages API)`,
    recommendedPosts.map((p) => p.slug),
  )

  res.status(200).json({ posts: recommendedPosts })
}
