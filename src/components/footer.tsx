import { format, parseISO } from 'date-fns'
import Container from '@/components/container'

interface Props {
  date: string
}

export function Footer({ date }: Props) {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <h3 className="text-4xl lg:text-[2.5rem] font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            Statically Generated with Next.js.
          </h3>
          <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
            <a
              href="https://github.com/benmvp/next-rendering"
              className="mx-3 font-bold hover:underline"
              target="_blank"
            >
              View on GitHub
            </a>
          </div>
        </div>
        <p className="text-sm text-center">
          Now:{' '}
          <time dateTime={date} suppressHydrationWarning>
            {format(parseISO(date), 'PPPPpppp')}
          </time>
        </p>
      </Container>
    </footer>
  )
}

export default Footer
