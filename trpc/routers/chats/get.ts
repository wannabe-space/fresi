import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { db } from '~/drizzle'
import { clerkClient } from '~/lib/clerk'
import { pick } from '~/lib/helpers'
import { createLogger } from '~/lib/logger'
import { publicProcedure } from '~/trpc'

const logger = createLogger('chats.get')

export const get = publicProcedure
  .input(z.object({
    id: z.string().uuid(),
  }))
  .query(async ({ ctx, input }) => {
    logger.info('get id', input.id)
    const chat = await db.query.chats.findFirst({
      where: (c, { eq }) => eq(c.id, input.id),
      with: {
        messages: {
          where: (m, { eq, or }) =>
            or(eq(m.role, 'assistant'), eq(m.role, 'user')),
          orderBy: (m, { asc }) => asc(m.createdAt),
          with: {
            sources: {
              columns: {
                url: true,
                docType: true,
                title: true,
                match: true,
              },
            },
          },
        },
      },
    })

    if (chat) {
      logger.info(`Found chat with title: "${chat.title}"`)
    }

    if (!chat) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }

    const isAvailable = chat.isPublic || ctx.userId === chat.userId

    if (!isAvailable) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }

    const user = pick(await clerkClient.users.getUser(chat.userId), ['id', 'imageUrl', 'emailAddresses'])

    logger.success('Sent', chat.id)

    return {
      ...chat,
      user,
    }
  })
