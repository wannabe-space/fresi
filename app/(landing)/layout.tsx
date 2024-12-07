import { Footer } from './components/footer'
import { Navbar } from './components/navbar'

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
