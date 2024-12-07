'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { RiArrowRightDoubleLine, RiCheckLine } from '@remixicon/react'
import { useQuery } from '@tanstack/react-query'
import { motion, useSpring } from 'motion/react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useSubscription } from '~/hooks/use-subscription'
import { SUBSCRIPTION_PRICES_PER_MONTH } from '~/lib/constants'
import { subscriptionCheckQuery } from '~/lib/query-keys'
import { cn } from '~/lib/ui'
import { PricingBlock } from './pricing-block'

export function Pricing({ className, ...props }: Omit<React.ComponentProps<'div'>, 'children'>) {
  const t = useTranslations()
  const springValue = useSpring(SUBSCRIPTION_PRICES_PER_MONTH.MONTHLY, {
    bounce: 0,
  })
  const { data: isSubscribed, isLoading: isCheckingSubscription } = useQuery(subscriptionCheckQuery())
  const [type, setType] = useState<'monthly' | 'yearly'>('monthly')

  const { isSubscribing, subscribe, actionIfLoggedIn } = useSubscription()

  useEffect(() => {
    springValue.set(type === 'monthly' ? SUBSCRIPTION_PRICES_PER_MONTH.MONTHLY : SUBSCRIPTION_PRICES_PER_MONTH.YEARLY)
  }, [type, springValue])

  const [pricesRef] = useAutoAnimate()
  const priceRef = useRef<HTMLSpanElement>(null)

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (priceRef.current) {
          const newPrice = `$${(+Intl.NumberFormat('en-US').format(
            latest,
          )).toFixed(2)}`
          priceRef.current.textContent = newPrice
        }
      }),
    [springValue],
  )

  return (
    <div className={cn('container', className)} {...props}>
      <div className="mb-40 px-horizontal">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-center text-subtitle font-semibold text-primary"
        >
          {t('views.home.pricing.title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0)', y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-16 max-w-5xl text-balance text-center text-h2"
        >
          {t('views.home.pricing.description')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 gap-6 xl:grid-cols-3"
        >
          <PricingBlock
            description={t('features.subscriptions.pro.description')}
            features={t.raw('features.subscriptions.pro.features')}
            title="Pay as you go"
            soon
            className="hidden xl:block"
          >
            <div className="mb-6 flex items-end text-5xl">
              <strong ref={priceRef}>
                $0.10
              </strong>
              <div className="mb-2 text-base leading-none text-gray-500">
                /
                {t('features.subscriptions.per-request')}
              </div>
            </div>
            <Button
              color="primary"
              className="w-full"
              size="lg"
              loading={isSubscribing}
              disabled={isCheckingSubscription || isSubscribed}
              onClick={() => actionIfLoggedIn(() => subscribe({ type }))}
            >
              {t(isSubscribed ? 'features.subscriptions.subscription-exists' : 'features.subscriptions.subscribe')}
              {isSubscribed
                ? (
                    <RiCheckLine className="size-5" />
                  )
                : (
                    <RiArrowRightDoubleLine className="size-5" />
                  )}
            </Button>
          </PricingBlock>
          <PricingBlock
            border
            description={t('features.subscriptions.pro.description')}
            features={t.raw('features.subscriptions.pro.features')}
            title={(
              <>
                Pro
                <Tabs defaultValue="monthly">
                  <TabsList>
                    <TabsTrigger
                      value="monthly"
                      onClick={() => setType('monthly')}
                    >
                      {t('features.subscriptions.monthly')}
                    </TabsTrigger>
                    <TabsTrigger
                      value="yearly"
                      onClick={() => setType('yearly')}
                    >
                      {t('features.subscriptions.yearly')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </>
            )}
          >
            <div ref={pricesRef} className="mb-6 flex items-end text-5xl">
              {type === 'yearly' && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    $
                    {SUBSCRIPTION_PRICES_PER_MONTH.MONTHLY}
                  </span>
                  &nbsp;
                </>
              )}
              <strong ref={priceRef}>
                $
                {springValue.get()}
              </strong>
              <div className="mb-2 text-base leading-none text-gray-500">
                /
                {t('labels.month')}
              </div>
            </div>
            <Button
              color="primary"
              className="w-full"
              size="lg"
              loading={isSubscribing}
              disabled={isCheckingSubscription || isSubscribed}
              onClick={() => actionIfLoggedIn(() => subscribe({ type }))}
            >
              {t(isSubscribed ? 'features.subscriptions.subscription-exists' : 'features.subscriptions.subscribe')}
              {isSubscribed
                ? (
                    <RiCheckLine className="size-5" />
                  )
                : (
                    <RiArrowRightDoubleLine className="size-5" />
                  )}
            </Button>
          </PricingBlock>
          <PricingBlock
            description={t('features.subscriptions.pro.description')}
            features={t.raw('features.subscriptions.pro.features')}
            title="Team"
            soon
            className="hidden xl:block"
          >
            <div className="mb-6 flex items-end text-5xl">
              <strong>Custom</strong>
            </div>
            <Button
              color="primary"
              className="w-full"
              size="lg"
              loading={isSubscribing}
              disabled={isCheckingSubscription || isSubscribed}
              onClick={() => actionIfLoggedIn(() => subscribe({ type }))}
            >
              {t(isSubscribed ? 'features.subscriptions.subscription-exists' : 'features.subscriptions.subscribe')}
              {isSubscribed
                ? (
                    <RiCheckLine className="size-5" />
                  )
                : (
                    <RiArrowRightDoubleLine className="size-5" />
                  )}
            </Button>
          </PricingBlock>
        </motion.div>
      </div>
    </div>
  )
}
