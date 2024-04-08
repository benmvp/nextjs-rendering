import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { CMS_NAME, HOME_OG_IMAGE_URL } from '@/lib/constants'
import { HeroPost } from '@/components/hero-post'
import { Intro } from '@/components/intro'
import { MoreStories } from '@/components/more-stories'
import type { Post } from '@/interfaces/post'
import { getAllPosts } from '@/lib/api'
import Container from '@/components/container'
import Alert from '@/components/alert'

interface Props {
  heroPost: Post
  remainingPosts: Post[]
}

export const getStaticProps: GetStaticProps<Props> = () => {
  const allPosts = getAllPosts()
  const heroPost = allPosts[0]
  const remainingPosts = allPosts.slice(1)

  return {
    props: {
      heroPost,
      remainingPosts,
    },
  }
}

export const metadata = {
  title: `Next.js Blog Example with ${CMS_NAME}`,
  description: `A statically generated blog example using Next.js and ${CMS_NAME}.`,
  openGraph: {
    images: [HOME_OG_IMAGE_URL],
  },
}

const Index: NextPage<Props> = ({ heroPost, remainingPosts }) => {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {metadata.openGraph.images.map((image) => (
          <meta
            key={image}
            property="og:image"
            content={image}
            suppressHydrationWarning
          />
        ))}
      </Head>
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
          />
          {remainingPosts.length > 0 && <MoreStories posts={remainingPosts} />}
        </Container>
      </main>
    </>
  )
}

export default Index
