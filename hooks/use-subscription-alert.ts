import { useTranslations } from 'next-intl'
import { useQuery } from 'queryzz/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { showFireworks } from '~/lib/confetti'

export function useSubscriptionAlert() {
  const t = useTranslations('app')
  const [subscription, setSubscription] = useQuery('subscription', { parse: false })

  useEffect(() => {
    if (subscription !== 'success') {
      return
    }

    showFireworks()
    setSubscription(undefined)

    const timeout = setTimeout(() => {
      toast.success(t('subscription-success'))
    }, 500)

    return () => clearTimeout(timeout)
  }, [])
}
