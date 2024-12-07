import type { QueryKey } from '@tanstack/react-query'
import type { AnyType } from './types'
import { isServer, QueryClient } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient({ initialData }: { initialData?: { queryKey: QueryKey, data: AnyType }[] }) {
  let client: QueryClient

  if (isServer) {
    // Server: always make a new query client
    client = makeQueryClient()
  }
  else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    browserQueryClient ||= makeQueryClient()

    client = browserQueryClient
  }

  if (initialData) {
    initialData.forEach(({ queryKey, data }) => {
      client.setQueryData(queryKey, data)
    })
  }

  return client
}
