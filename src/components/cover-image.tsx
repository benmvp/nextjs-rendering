import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { RenderMode } from '@/interfaces/render'

type Props = {
  renderMode: RenderMode
  title: string
  src: string
  slug?: string
}

const CoverImage = ({ renderMode, title, src, slug }: Props) => {
  const image = (
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn('shadow-sm w-full', {
        'hover:shadow-lg transition-shadow duration-200': slug,
      })}
      width={1300}
      height={630}
    />
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts-${renderMode}/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

export default CoverImage
