import type { NextPage } from 'next'
import Footer from './footer'

interface Props {
  date: string
  children: React.ReactNode
}

const PageLayout: NextPage<Props> = ({ children, date }: Props) => {
  return (
    <>
      <div className="min-h-screen">{children}</div>
      <Footer date={date} />
    </>
  )
}

export default PageLayout
