import type { NextApiRequest, NextApiResponse } from 'next'
import { getPostBySlug } from '@/lib/api'
import { Post } from '@/interfaces/post'
import { wait } from '@/lib/wait'

interface ResponseData {
  post: Post
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
  const post = await getPostBySlug(slug)

  if (!post) {
    res.status(404).end()
    return
  }

  console.log('Retrieved post (API)', post.slug)

  res.status(200).json({ post })
}
