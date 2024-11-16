import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import uaParser from 'ua-parser-js'
import { getPostBySlug } from '@/lib/api'
import { CMS_NAME } from '@/lib/constants'
import markdownToHtml from '@/lib/markdownToHtml'
import Alert from '@/components/alert'
import Container from '@/components/container'
import Header from '@/components/header'
import { PostBody } from '@/components/post-body'
import { PostHeader } from '@/components/post-header'
import { RecommendedPosts } from '@/components/recommended-posts-server'
import OtherRenderModes from '@/components/other-render-modes'

interface Params {
  params: {
    slug: string
  }
}

export default async function Post({ params }: Params) {
  // Make this route dynamically rendered by accessing the headers. It now
  // relies on request-time data.
  const allHeaders = await headers()
  const userAgent = uaParser(allHeaders.get('user-agent') || '')

  const post = await getPostBySlug(params.slug)

  // For Internet Explorer, we'll render a 404 page. This is just an example
  // so that we can render server-side
  if (!post || userAgent.browser.name === 'IE') {
    return notFound()
  }

  console.log('Retrieved post (SSR)', post.slug)

  const content = await markdownToHtml(post.content || '')

  return (
    <main>
      <Alert preview={post.preview} />
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />
          <RecommendedPosts slug={post.slug} renderMode="ssr" />
          <OtherRenderModes slug={post.slug} renderMode="ssr" />
        </article>
      </Container>
    </main>
  )
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return notFound()
  }

  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`

  return {
    title,
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  }
}
