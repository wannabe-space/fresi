import { auth } from '@clerk/nextjs/server'
import 'server-only'

export async function createContext() {
  const { userId } = await auth()

  return {
    userId,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
