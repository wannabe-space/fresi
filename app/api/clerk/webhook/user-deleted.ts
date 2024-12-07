import type { WebhookEvent } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { chats, db, subscriptions } from '~/drizzle'

export async function userDeleted(event: WebhookEvent) {
  const { id } = event.data

  if (!id)
    return

  await db.transaction(async (tx) => {
    await tx.delete(chats).where(eq(chats.userId, id))
    await tx.delete(subscriptions).where(eq(subscriptions.userId, id))
  })
}
