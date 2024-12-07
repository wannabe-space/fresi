import { clerkClient } from '@clerk/nextjs/server'
import { createLogger } from '~/lib/logger'
import { publicProcedure } from '~/trpc'

const logger = createLogger('profile.get')

export const get = publicProcedure.query(async ({ ctx }) => {
  if (!ctx.userId) {
    return null
  }

  const clerk = await clerkClient()

  try {
    return await clerk.users.getUser(ctx.userId)
  }
  catch (error) {
    logger.error('Failed to get user', error)
    return null
  }
})
