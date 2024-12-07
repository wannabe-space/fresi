import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  shared: {
    NEXT_PUBLIC_URL: z.string().min(1),
  },
  server: {
    DATABASE_URL: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
    XAI_API_KEY: z.string().min(1),
    STRIPE_MONTHLY_PRICE_ID: z.string().min(1),
    STRIPE_YEARLY_PRICE_ID: z.string().min(1),
    SENTRY_AUTH_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
})
