'use client'

import { useEffect, useState } from 'react'
import { MoreStories } from './more-stories'
import { type RenderMode } from './post-preview'
import { Post } from '@/interfaces/post'

interface Props {
  slug: string
  renderMode: RenderMode
}

function Loading() {
  return <p className="text-xl mt-32 text-center">Loading recommendations...</p>
}

export function RecommendedPosts({ slug, renderMode }: Props) {
  const [recommendedPosts, setRecommendedPosts] = useState<Post[] | null>(null)

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      const res = await fetch(`/api/posts/${slug}/recommended`)
      const { posts } = (await res.json()) as { posts: Post[] }

      setRecommendedPosts(posts)
    }

    if (slug) {
      fetchRecommendedPosts()
    }
  }, [slug])

  if (recommendedPosts?.length === 0) {
    return null
  }

  return recommendedPosts ? (
    <MoreStories posts={recommendedPosts} renderMode={renderMode} />
  ) : (
    <Loading />
  )
}
