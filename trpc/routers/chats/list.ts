import { z } from 'zod'
import { db } from '~/drizzle'
import { protectedProcedure } from '~/trpc'

export const list = protectedProcedure
  .input(
    z.object({
      offset: z.number().optional(),
    })
      .optional(),
  )
  .query(async ({ ctx, input }) => {
    return db.query.chats.findMany({
      where: (chats, { eq }) => eq(chats.userId, ctx.userId),
      orderBy: (chats, { desc }) => [desc(chats.createdAt)],
      limit: 50,
      offset: input?.offset || 0,
      columns: {
        id: true,
        title: true,
        createdAt: true,
      },
      // with: {
      //   messages: {
      //     columns: {},
      //     with: {
      //       sources: true,
      //     },
      //   },
      // },
    })
  })
