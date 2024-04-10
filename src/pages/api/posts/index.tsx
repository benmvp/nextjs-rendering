import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllPosts } from '@/lib/api'
import { Post } from '@/interfaces/post'
import { wait } from '@/lib/wait'

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

  const posts = await getAllPosts()

  res.status(200).json({ posts })
}
