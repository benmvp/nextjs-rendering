import { NextPage } from 'next'
import Contents from './Contents'

interface PageProps {
  params: Promise<{ slug: string }>
}

const PostPage: NextPage<PageProps> = async ({ params }) => {
  const { slug } = await params

  return <Contents slug={slug} />
}

export default PostPage
