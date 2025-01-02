import type { subscriptionType } from '~/drizzle'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { env } from '~/env'
import { FREE_TRIAL_DAYS } from '~/lib/constants'
import { getStripeCustomerIdByEmail, stripe } from '~/lib/stripe'
import { userProcedure } from '~/trpc'
import { getSubscriptionStatus } from '~/trpc/utils/subscription'

const plans = {
  monthly: env.STRIPE_MONTHLY_PRICE_ID,
  yearly: env.STRIPE_YEARLY_PRICE_ID,
}

export const manage = userProcedure
  .input(z.object({
    type: z.enum(['monthly', 'yearly'] satisfies typeof subscriptionType.enumValues),
  }))
  .mutation(async ({ ctx, input }) => {
    const [{ exists }, customerId] = await Promise.all([
      getSubscriptionStatus(ctx.user.id),
      getStripeCustomerIdByEmail(ctx.user.primaryEmailAddress.emailAddress),
    ])

    let url: string | null

    if (exists) {
      if (!customerId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User does not have a Stripe customer ID' })
      }

      const configuration = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${env.NEXT_PUBLIC_URL}/chat`,
      })

      url = configuration.url
    }
    else {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            price: plans[input.type],
            quantity: 1,
          },
        ],
        customer: customerId || undefined,
        customer_email: customerId ? undefined : ctx.user.primaryEmailAddress.emailAddress,
        success_url: `${env.NEXT_PUBLIC_URL}/chat?subscription=success`,
        cancel_url: `${env.NEXT_PUBLIC_URL}/home`,
        subscription_data: {
          trial_period_days: FREE_TRIAL_DAYS,
        },
      })

      url = session.url
    }

    if (!url) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create billing portal session' })
    }

    return { url }
  })
