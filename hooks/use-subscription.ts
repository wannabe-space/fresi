import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { pushModal } from '~/components/modals'
import { subscriptionCheckQuery, subscriptionManageMutation } from '~/lib/query-keys'
import { useUser } from './use-user'

export function useSubscription() {
  const t = useTranslations('app')
  const router = useRouter()
  const { user } = useUser()
  const { mutateAsync, isPending: isSubscribing } = useMutation(subscriptionManageMutation())
  const { data: isSubscribed, isLoading: isCheckingSubscription } = useQuery(subscriptionCheckQuery())

  async function subscribe({ type }: { type: 'monthly' | 'yearly' }) {
    const { url } = await mutateAsync({ type })

    router.push(url)
  }

  function validateSubscription() {
    if (!user) {
      pushModal('SignUp')
      return false
    }

    if (!isSubscribed) {
      router.push('/home#pricing')
      toast.info(t('subscription-required'))
      return false
    }

    return true
  }

  async function actionIfSubscribed(fn: () => Promise<void> | void) {
    const isSubscribed = validateSubscription()

    if (isSubscribed)
      await fn()
  }

  async function actionIfNotSubscribed(fn: () => Promise<void> | void) {
    const isSubscribed = validateSubscription()

    if (!isSubscribed)
      await fn()
  }

  async function actionIfLoggedIn(fn: () => Promise<void> | void) {
    if (!user) {
      pushModal('SignUp')
      return false
    }

    await fn()
  }

  return {
    subscribe,
    isSubscribing,
    actionIfSubscribed,
    actionIfNotSubscribed,
    actionIfLoggedIn,
    isSubscribed,
    isCheckingSubscription,
    validateSubscription,
  }
}
