import { auth } from '@clerk/nextjs/server'
import { isSubscriptionActive } from '~/trpc/utils/subscription'

export async function GET(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return Response.redirect(new URL('/sign-up', request.url))
  }

  const isActive = await isSubscriptionActive(userId)

  return Response.redirect(new URL(isActive ? '/chat' : '/home', request.url))
}
