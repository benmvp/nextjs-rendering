import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, getPostSlugs } from '@/lib/api'
import { CMS_NAME } from '@/lib/constants'
import markdownToHtml from '@/lib/markdownToHtml'
import Alert from '@/components/alert'
import Container from '@/components/container'
import Header from '@/components/header'
import { PostBody } from '@/components/post-body'
import { PostHeader } from '@/components/post-header'
import { MoreStories } from '@/components/more-stories'

interface Params {
  params: {
    slug: string
  }
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await getPostSlugs()

  return posts.map((slug) => ({
    slug,
  }))
}

export default async function Post({ params }: Params) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return notFound()
  }

  const remainingPosts = (await getAllPosts()).filter(
    (p) => p.slug !== post.slug,
  )

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
          {remainingPosts.length > 0 && <MoreStories posts={remainingPosts} />}
        </article>
      </Container>
    </main>
  )
}

export async function generateMetadata({ params }: Params): Metadata {
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
