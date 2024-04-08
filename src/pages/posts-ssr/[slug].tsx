import { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import { CMS_NAME } from '@/lib/constants'
import markdownToHtml from '@/lib/markdownToHtml'
import Alert from '@/components/alert'
import Container from '@/components/container'
import Header from '@/components/header'
import { MoreStories } from '@/components/more-stories'
import { PostBody } from '@/components/post-body'
import { PostHeader } from '@/components/post-header'
import type { Post } from '@/interfaces/post'
import PageLayout from '@/components/page-layout'
import { getPostBySlug } from '@/lib/api'
import { useEffect, useState } from 'react'

interface DisplayPost extends Post {
  htmlContent: string
}

interface Props {
  post: DisplayPost
}

export const getServerSideProps: GetServerSideProps<
  Props,
  { slug: string | undefined }
> = async ({ params }) => {
  const post = await getPostBySlug(params?.slug)

  if (!post) {
    return { notFound: true }
  }

  console.log('Retrieved post (SSR)', post.slug)

  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        htmlContent: content,
      },
    },
  }
}

const PostPage: NextPage<Props> = ({ post }) => {
  const slug = post.slug
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([])

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

  return (
    <PageLayout>
      <Meta post={post} />

      <main>
        <Alert />
        <Container>
          <Header />
          <article className="mb-32">
            <PostHeader
              title={post.title}
              coverImage={post.coverImage}
              date={post.date}
              author={post.author}
            />
            <PostBody content={post.htmlContent} />
            {recommendedPosts.length > 0 && (
              <MoreStories posts={recommendedPosts} renderMode="ssr" />
            )}
          </article>
        </Container>
      </main>
    </PageLayout>
  )
}

export default PostPage

interface MetaProps {
  post: Post
}

function Meta({ post }: MetaProps) {
  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`

  const metadata = {
    title,
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  }

  return (
    <Head>
      <title>{metadata.title}</title>
      {metadata.openGraph.images.map((image) => (
        <meta
          key={image}
          property="og:image"
          content={image}
          suppressHydrationWarning
        />
      ))}
    </Head>
  )
}
