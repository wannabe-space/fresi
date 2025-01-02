import { db } from '~/drizzle'

export async function getSubscriptionStatus(userId: string) {
  const subscription = await db.query.subscriptions.findFirst({
    where: (s, { eq }) => eq(s.userId, userId),
  })

  if (!subscription) {
    return {
      hasActiveSubscription: false,
      hasSubscription: false,
      status: null,
    }
  }

  return {
    hasActiveSubscription: subscription.data.status === 'active' || subscription.data.status === 'trialing',
    hasSubscription: subscription.data.status === 'active' || subscription.data.status === 'trialing' || subscription.data.status === 'past_due' || subscription.data.status === 'unpaid' || subscription.data.status === 'paused' || subscription.data.status === 'incomplete' || subscription.data.status === 'incomplete_expired',
    status: subscription.data.status,
  }
}
