import { Suspense } from 'react'
import { MoreStories } from './more-stories'
import { getRecommendedPosts } from '@/lib/api'
import { RenderMode } from '@/interfaces/render'

interface Props {
  renderMode: RenderMode
  slug: string
}

function Loading() {
  return <p className="text-xl mt-32 text-center">Loading recommendations...</p>
}

async function RecommendedPostsLoadable({ slug, renderMode }: Props) {
  const recommendedPosts = await getRecommendedPosts(slug)

  console.log(
    `Retrieved recommended posts for "${slug}" (server component)`,
    recommendedPosts.map((p) => p.slug),
  )

  if (recommendedPosts.length === 0) {
    return null
  }

  return <MoreStories posts={recommendedPosts} renderMode={renderMode} />
}

export async function RecommendedPosts({ slug, renderMode }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <RecommendedPostsLoadable renderMode={renderMode} slug={slug} />
    </Suspense>
  )
}
