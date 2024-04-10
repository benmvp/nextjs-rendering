import { Post } from '@/interfaces/post'
import { readdir, readFile } from 'fs-extra'
import matter from 'gray-matter'
import { join } from 'path'
import { wait } from './wait'

const postsDirectory = join(process.cwd(), '_posts')

export async function getPostSlugs() {
  const fileNames = await readdir(postsDirectory)

  return fileNames.map((fileName) => fileName.replace(/\.md$/, ''))
}

export async function getPostBySlug(slug: string | undefined) {
  // Simulate a slow API
  await wait(Math.random() * 5000)

  if (!slug) {
    return null
  }

  const fullPath = join(postsDirectory, `${slug}.md`)
  const fileContents = await readFile(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return { ...data, slug, content } as Post
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = await getPostSlugs()
  const posts = (await Promise.all(slugs.map((slug) => getPostBySlug(slug))))
    // filter out `null` values
    .filter((post): post is Post => Boolean(post))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))

  return posts
}

export async function getRecommendedPosts(slug: string | undefined) {
  const allPosts = await getAllPosts()

  // filter out the current post, randomly sort, and take the first 2
  return allPosts
    .filter((post) => post.slug !== slug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
}
