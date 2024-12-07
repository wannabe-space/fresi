import { useUser as useClerkUser } from '@clerk/nextjs'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { profileQuery, subscriptionCheckQuery } from '~/lib/query-keys'

export function useUser() {
  const { data: user } = useQuery({
    ...profileQuery(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  return { user: user || null }
}

// Use only in the main layout to sync the user from clerk to the query client
export function useSyncUser() {
  const { user: clerkUser, isLoaded } = useClerkUser()

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isLoaded)
      return

    queryClient.invalidateQueries(subscriptionCheckQuery())
    queryClient.setQueryData(profileQuery().queryKey, clerkUser || null)
  }, [clerkUser, isLoaded])
}
