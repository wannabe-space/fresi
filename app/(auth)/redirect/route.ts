import { auth } from '@clerk/nextjs/server'
import { getSubscriptionStatus } from '~/trpc/utils/subscription'

export async function GET(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return Response.redirect(new URL('/sign-up', request.url))
  }

  const { isActive } = await getSubscriptionStatus(userId)

  return Response.redirect(new URL(isActive ? '/chat' : '/home', request.url))
}
