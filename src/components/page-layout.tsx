import type { NextPage } from 'next'
import Footer from './footer'

interface Props {
  children: React.ReactNode
}

const PageLayout: NextPage<Props> = ({ children }: Props) => {
  return (
    <>
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  )
}

export default PageLayout
