'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { parse } from 'superjson'
import { getQueryClient } from '~/lib/query-client'

export function QueryProvider({ children, initialData }: { children: React.ReactNode, initialData: string }) {
  const queryClient = getQueryClient({ initialData: parse(initialData) })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
