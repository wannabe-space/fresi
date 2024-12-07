'use client'

import { RiArrowRightDoubleLine, RiCheckLine } from '@remixicon/react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useTranslations } from 'next-intl'
import { TypeAnimation } from 'react-type-animation'
import { DustCanvas } from '~/components/dust-canvas'
import { Button } from '~/components/ui/button'
import { useSubscription } from '~/hooks/use-subscription'
import { scrollTo } from '~/lib/ui'
import { resources } from '~/resources'

const resourcesList = [
  'JavaScript',
  ...resources.map(resource => resource.label),
].flatMap(r => [`${r}-First`, 2000])

export function Hero() {
  const t = useTranslations()
  const { isSubscribing, actionIfLoggedIn, isSubscribed, isCheckingSubscription } = useSubscription()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 700], [0, 400])

  return (
    // Sync with navbar.tsx
    <div className="container relative flex h-svh py-4">
      <div className="relative flex w-full items-center justify-center overflow-hidden rounded-3xl border border-b-0 border-black/10 bg-gradient-to-t from-zinc-50 to-white dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
        <motion.div
          className="absolute -top-full z-10 size-[150%] bg-[radial-gradient(circle_at_center,theme(colors.primary.DEFAULT)_0%,rgba(255,255,255,0)_30%)] blur-3xl"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3 }}
        />
        <DustCanvas className="absolute inset-x-0 -top-2/3 bottom-2/3 opacity-30" amount={150} />
        <motion.main
          style={{ y }}
          className="relative z-20 px-6 py-24 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 1 }}
            className="m-auto mb-6 text-balance text-h1 leading-none lg:mb-8 lg:max-w-4xl"
          >
            <TypeAnimation
              preRenderFirstString
              sequence={resourcesList}
              wrapper="div"
              cursor={true}
              speed={1}
              repeat={Infinity}
              className="whitespace-nowrap text-primary"
            />
            {t('views.home.hero.title')}
          </motion.h1>
          <div className="m-auto max-w-xl">
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 0.7, scale: 1 }}
              transition={{ type: 'spring', duration: 1, delay: 0.1 }}
              className="mx-auto mb-10 text-balance text-base !leading-[1.4] sm:text-xl"
            >
              {t('views.home.hero.description')}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 1, delay: 0.2 }}
            className="flex justify-center gap-4"
          >
            <Button
              size="lg"
              disabled={isCheckingSubscription || isSubscribed}
              loading={isSubscribing}
              onClick={() => actionIfLoggedIn(() => scrollTo('#pricing'))}
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
          </motion.div>
        </motion.main>
      </div>
    </div>
  )
}
