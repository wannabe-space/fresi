import { publicProcedure } from '~/trpc'
import { isSubscriptionActive } from '~/trpc/utils/subscription'

export const check = publicProcedure.query(async ({ ctx }) => ctx.userId ? isSubscriptionActive(ctx.userId) : false)
