import Container from '@/components/container'
import { HeroPost } from '@/components/hero-post'
import { Intro } from '@/components/intro'
import { MoreStories } from '@/components/more-stories'
import { getAllPosts } from '@/lib/api'

export default async function Index() {
  const allPosts = await getAllPosts()

  const heroPost = allPosts[0]

  const morePosts = allPosts.slice(1)

  return (
    <main>
      <Container>
        <Intro />
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
          renderMode="app"
        />
        {morePosts.length > 0 && (
          <MoreStories posts={morePosts} renderMode="app" />
        )}
      </Container>
    </main>
  )
}
