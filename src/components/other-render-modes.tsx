import { RenderMode } from '@/interfaces/render'
import { RENDER_MODES } from '@/lib/constants'
import Link from 'next/link'

interface Props {
  renderMode: RenderMode
  slug: string
}

const LABELS = {
  csr: 'Client-side rendering',
  ssr: 'Server-side rendering',
  ssg: 'Static site generation',
  isr: 'Incremental static regeneration',
  app: 'App router',
}

export default function OtherRenderModes({ renderMode, slug }: Props) {
  const displayRenderModes = RENDER_MODES.filter(
    (testRenderMode) => testRenderMode !== renderMode,
  )

  return (
    <div>
      <h3 className="text-2xl mt-10">View this post with:</h3>
      <div className="flex justify-between text-xl mt-10">
        {displayRenderModes.map((displayRenderMode) => (
          <Link
            key={displayRenderMode}
            href={`/posts-${displayRenderMode}/${slug}`}
            className="hover:underline"
          >
            {LABELS[displayRenderMode]}
          </Link>
        ))}
      </div>
    </div>
  )
}
