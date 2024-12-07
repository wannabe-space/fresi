import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { chats, db } from '~/drizzle'
import { createLogger } from '~/lib/logger'
import { protectedProcedure } from '~/trpc'

const logger = createLogger('chats.remove')

export const remove = protectedProcedure
  .input(z.object({
    chatId: z.string().uuid(),
  }))
  .mutation(async ({ ctx, input }) => {
    await db.delete(chats).where(and(eq(chats.userId, ctx.userId), eq(chats.id, input.chatId)))
    logger.success(`chat removed`, input.chatId)
  })
