import { stringify } from 'superjson'
import { profileQuery, subscriptionCheckQuery } from '~/lib/query-keys'
import { trpc } from '~/trpc/server'
import { QueryProvider } from './query-provider'

export async function DataProvider({ children }: { children: React.ReactNode }) {
  const [profile, subscription] = await Promise.all([
    trpc.profile.get(),
    trpc.subscriptions.check(),
  ])
  const initialData = [
    {
      queryKey: profileQuery().queryKey,
      data: profile,
    },
    {
      queryKey: subscriptionCheckQuery().queryKey,
      data: subscription,
    },
  ]

  return (
    <QueryProvider initialData={stringify(initialData)}>
      {children}
    </QueryProvider>
  )
}
