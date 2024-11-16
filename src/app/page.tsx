import Alert from '@/components/alert'
import Container from '@/components/container'
import { HeroPost } from '@/components/hero-post'
import { Intro } from '@/components/intro'
import { MoreStories } from '@/components/more-stories'
import { getAllPosts } from '@/lib/api'
import { CMS_NAME, HOME_OG_IMAGE_URL } from '@/lib/constants'
import { Metadata } from 'next'

export default async function Index() {
  const allPosts = await getAllPosts()

  const heroPost = allPosts[0]

  const morePosts = allPosts.slice(1)

  return (
    <main>
      <Alert />
      <Container>
        <Intro />
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
          renderMode="ssg"
        />
        {morePosts.length > 0 && (
          <MoreStories posts={morePosts} renderMode="ssg" />
        )}
      </Container>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `Next.js Blog Example with ${CMS_NAME}`

  return {
    title,
    description: `A statically generated blog example using Next.js and ${CMS_NAME}.`,
    openGraph: {
      title,
      images: [HOME_OG_IMAGE_URL],
    },
  }
}
