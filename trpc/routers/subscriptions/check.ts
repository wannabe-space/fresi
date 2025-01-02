import { publicProcedure } from '~/trpc'
import { getSubscriptionStatus } from '~/trpc/utils/subscription'

export const check = publicProcedure.query(async ({ ctx }) => {
  if (!ctx.userId) {
    return false
  }

  const { isActive } = await getSubscriptionStatus(ctx.userId)

  return isActive
})
