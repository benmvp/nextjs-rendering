import { NextPage } from 'next'
import Head from 'next/head'
import { CMS_NAME } from '@/lib/constants'
import markdownToHtml from '@/lib/markdownToHtml'
import Alert from '@/components/alert'
import Container from '@/components/container'
import Header from '@/components/header'
import { PostBody } from '@/components/post-body'
import { PostHeader } from '@/components/post-header'
import type { Post } from '@/interfaces/post'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PageLayout from '@/components/page-layout'
import { RecommendedPosts } from '@/components/recommended-posts-client'
import OtherRenderModes from '@/components/other-render-modes'

interface DisplayPost extends Post {
  htmlContent: string
}

interface Props {}

const PostPage: NextPage<Props> = () => {
  const date = new Date().toISOString()
  const router = useRouter()
  const slug = router.query.slug as string | undefined
  const [post, setPost] = useState<DisplayPost | undefined>(undefined)

  useEffect(() => {
    // We have access to cookies, headers, and other user-specific data here
    // because this function runs at request time on the client

    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${slug}`)
      const { post } = (await res.json()) as { post: Post }
      const htmlContent = await markdownToHtml(post.content || '')

      setPost({ ...post, htmlContent })
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  return post ? (
    <PageLayout date={date}>
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
            <RecommendedPosts slug={post.slug} renderMode="csr" />
            <OtherRenderModes slug={slug} renderMode="csr" />
          </article>
        </Container>
      </main>
    </PageLayout>
  ) : (
    <p className="text-4xl mt-32 text-center">Loading...</p>
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
