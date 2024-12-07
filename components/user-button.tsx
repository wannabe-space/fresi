'use client'

import { UserButton as ClerkUserButton } from '@clerk/nextjs'
import { RiHomeLine, RiPriceTag3Line } from '@remixicon/react'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAppContext } from '~/app/app-context'
import { subscriptionManageMutation } from '~/lib/query-keys'
import { Skeleton } from './ui/skeleton'

export function UserButton() {
  const t = useTranslations()
  const pathname = usePathname()
  const { setIsLoading } = useAppContext()
  const { mutateAsync, isPending } = useMutation(subscriptionManageMutation())

  useEffect(() => {
    setIsLoading(isPending)
  }, [isPending])

  const handleManageSubscription = async () => {
    const { url } = await mutateAsync({ type: 'monthly' })

    location.assign(url)
  }

  return (
    <div className="relative size-8 min-w-8">
      <Skeleton className="absolute inset-0 -z-10 rounded-lg" />
      <ClerkUserButton>
        <ClerkUserButton.MenuItems>
          <ClerkUserButton.Action
            label={t('features.subscriptions.manage-subscription')}
            labelIcon={<RiPriceTag3Line className="size-4" />}
            onClick={() => handleManageSubscription()}
          />
          {pathname.includes('/chat') && (
            <ClerkUserButton.Link
              label={t('labels.home')}
              labelIcon={<RiHomeLine className="size-4" />}
              href="/home"
            />
          )}
        </ClerkUserButton.MenuItems>
      </ClerkUserButton>
    </div>
  )
}
