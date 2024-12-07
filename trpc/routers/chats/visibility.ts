import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { chats, db } from '~/drizzle'
import { subscriptionProcedure } from '~/trpc'

export const visibility = subscriptionProcedure.input(z.object({
  chatId: z.string().uuid(),
  isPublic: z.boolean(),
})).mutation(async ({ ctx, input }) => {
  const [{ isPublic }] = await db
    .update(chats)
    .set({
      isPublic: input.isPublic,
    })
    .where(
      and(
        eq(chats.id, input.chatId),
        eq(chats.userId, ctx.userId),
      ),
    )
    .returning({
      isPublic: chats.isPublic,
    })

  return isPublic
})
