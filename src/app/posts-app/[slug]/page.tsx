import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPostSlugs } from '@/lib/api'
import { CMS_NAME } from '@/lib/constants'
import markdownToHtml from '@/lib/markdownToHtml'
import Alert from '@/components/alert'
import Container from '@/components/container'
import Header from '@/components/header'
import { PostBody } from '@/components/post-body'
import { PostHeader } from '@/components/post-header'
import { RecommendedPosts } from '@/components/recommended-posts-server'

interface Params {
  params: {
    slug: string
  }
}

// Return a list of `params` to statically generate blog post routes at build
// time instead of on-demand at request time.
export async function generateStaticParams() {
  const posts = await getPostSlugs()

  return posts.map((slug) => ({
    slug,
  }))
}

export default async function Post({ params }: Params) {
  const post = await getPostBySlug(params.slug)

  // By default, this will return a static page for everyone. But if we access
  // cookies, headers, etc. the route will be dynamically rendered to because it
  // now relies on request-time data.

  if (!post) {
    return notFound()
  }

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
          <RecommendedPosts slug={post.slug} />
        </article>
      </Container>
    </main>
  )
}

// revalidate (i.e. refresh) the post every 15 seconds
export const revalidate = 15

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
