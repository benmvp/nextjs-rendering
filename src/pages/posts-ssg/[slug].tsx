import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { CMS_NAME } from '@/lib/constants'
import markdownToHtml from '@/lib/markdownToHtml'
import Alert from '@/components/alert'
import Container from '@/components/container'
import Header from '@/components/header'
import { PostBody } from '@/components/post-body'
import { PostHeader } from '@/components/post-header'
import type { Post } from '@/interfaces/post'
import PageLayout from '@/components/page-layout'
import { getPostBySlug, getPostSlugs } from '@/lib/api'
import { RecommendedPosts } from '@/components/recommended-posts-client'

interface DisplayPost extends Post {
  htmlContent: string
}

interface Props {
  date: string
  post: DisplayPost
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getPostSlugs()

  console.log('Retrieved slugs (SSG)', slugs)

  return {
    paths: slugs.map((slug) => {
      return {
        params: {
          slug,
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<
  Props,
  { slug: string | undefined }
> = async ({ params }) => {
  const post = await getPostBySlug(params?.slug)

  // We don't have access to cookies, headers, and other user-specific data here
  // because this function runs at build time

  if (!post) {
    return { notFound: true }
  }

  console.log('Retrieved post (SSG)', post.slug)

  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      date: new Date().toISOString(),
      post: {
        ...post,
        htmlContent: content,
      },
    },
  }
}

const PostPage: NextPage<Props> = ({ date, post }) => {
  const slug = post.slug

  return (
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
            <RecommendedPosts slug={slug} renderMode="ssg" />
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
