'use client'

import type { AppRouter } from './routers'
import { createTRPCClient, unstable_httpBatchStreamLink } from '@trpc/client'
import SuperJSON from 'superjson'
import { env } from '~/env'

export const trpc = createTRPCClient<AppRouter>({
  links: [
    unstable_httpBatchStreamLink({
      transformer: SuperJSON,
      url: `${env.NEXT_PUBLIC_URL}/api/trpc`,
    }),
  ],
})
