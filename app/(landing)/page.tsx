import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import HomePage from './home/page'

export default async function IndexPage() {
  const { userId } = await auth()

  if (userId) {
    return redirect('/chat')
  }

  return <HomePage />
}
