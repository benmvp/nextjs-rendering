import { Suspense } from 'react'
import { MoreStories } from './more-stories'
import { getRecommendedPosts } from '@/lib/api'

interface Props {
  slug: string
}

function Loading() {
  return <p className="text-xl mt-32 text-center">Loading recommendations...</p>
}

async function RecommendedPostsLoadable({ slug }: Props) {
  const recommendedPosts = await getRecommendedPosts(slug)

  console.log(
    `Retrieved recommended posts for "${slug}" (app server component)`,
    recommendedPosts.map((p) => p.slug),
  )

  if (recommendedPosts.length === 0) {
    return null
  }

  return <MoreStories posts={recommendedPosts} renderMode="app" />
}

export async function RecommendedPosts({ slug }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <RecommendedPostsLoadable slug={slug} />
    </Suspense>
  )
}
