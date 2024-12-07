import type { EmailAddress, User } from '@clerk/nextjs/server'
import type { Context } from '~/trpc/context'
import { currentUser } from '@clerk/nextjs/server'
import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'
import { ZodError } from 'zod'
import { db } from '~/drizzle'

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const router = t.router

export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use((opts) => {
  if (!opts.ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      userId: opts.ctx.userId,
    },
  })
})

export const userProcedure = protectedProcedure.use(async (opts) => {
  const user = await currentUser()

  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  if (!user.primaryEmailAddress) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'User has no primary email address' })
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user: user as Omit<User, 'primaryEmailAddress'> & { primaryEmailAddress: EmailAddress },
    },
  })
})

export const subscriptionProcedure = protectedProcedure.use(async (opts) => {
  const subscription = await db.query.subscriptions.findFirst({
    where: (s, { eq }) => eq(s.userId, opts.ctx.userId),
  })

  if (!subscription) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'User has no subscription' })
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      subscription,
    },
  })
})
