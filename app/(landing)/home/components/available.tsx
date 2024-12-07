'use client'

import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useAppContext } from '~/app/app-context'
import { DocIcon } from '~/components/doc-icon'
import { Button } from '~/components/ui/button'
import { useSubscription } from '~/hooks/use-subscription'
import { cn } from '~/lib/ui'
import { resources } from '~/resources'

export function Available({ className, id }: Pick<React.ComponentProps<'div'>, 'className' | 'id'>) {
  const t = useTranslations('views.home.available')
  const { actionIfSubscribed } = useSubscription()
  const router = useRouter()
  const { isDesktop } = useAppContext()

  return (
    <div id={id} className={cn('overflow-hidden py-32 -my-32', className)}>
      <div className="container relative lg:max-w-5xl">
        <div className="absolute left-1/2 top-1/2 z-10 h-full w-[400%] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.primary.DEFAULT)_0%,rgba(255,255,255,0)_30%)] opacity-30 blur-3xl"
          />
        </div>
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-20 mx-auto flex flex-col items-center justify-center gap-6 rounded-3xl border border-black/10 bg-white px-4 py-10 dark:border-white/10 dark:bg-zinc-900 md:py-20 lg:py-32"
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-h3"
          >
            {t('libraries')}
          </motion.h3>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex max-w-3xl flex-wrap items-center justify-center gap-2 lg:gap-4"
          >
            {resources.map((resource, index) => (
              <motion.div
                key={resource.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              >
                <Button
                  href={`/chat?doc=${resource.type}`}
                  variant="outline"
                  size={isDesktop ? 'sm' : 'xs'}
                  onClick={(e) => {
                    e.preventDefault()
                    actionIfSubscribed(() => router.push(`/chat?doc=${resource.type}`))
                  }}
                >
                  <DocIcon name={resource.type} />
                  {resource.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative z-20 max-w-xl text-balance text-center"
          >
            {t('but-anything')}
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
