import { RiBardFill, RiQuestionAnswerFill, RiRefreshLine } from '@remixicon/react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { cn } from '~/lib/ui'

export function HowItWorks({ className, ...props }: Pick<React.ComponentProps<'div'>, 'className' | 'id'>) {
  const t = useTranslations()

  const steps = [
    {
      title: t('views.home.how-it-works.update.title'),
      description: t.markup('views.home.how-it-works.update.description', {
        b: chunks => `<b>${chunks}</b>`,
      }),
      icon: <RiRefreshLine className="size-full" />,
    },
    {
      title: t('views.home.how-it-works.ai.title'),
      description: t.markup('views.home.how-it-works.ai.description', {
        b: chunks => `<b>${chunks}</b>`,
      }),
      icon: <RiBardFill className="size-full" />,
    },
    {
      title: t('views.home.how-it-works.chat.title'),
      description: t.markup('views.home.how-it-works.chat.description', {
        b: chunks => `<b>${chunks}</b>`,
      }),
      icon: <RiQuestionAnswerFill className="size-full" />,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={cn('container', className)}
      {...props}
    >
      <div className="mx-auto max-w-7xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-center text-subtitle font-semibold text-primary"
        >
          {t('views.home.how-it-works.title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0)', y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-16 max-w-5xl text-balance text-center text-h1"
        >
          {t('views.home.how-it-works.description')}
        </motion.p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={step.title}
              className="relative rounded-3xl border border-black/10 bg-white px-4 py-8 duration-150 dark:border-white/10 dark:bg-zinc-900 lg:px-10 lg:py-12 hover-support:hover:scale-[1.02]"
            >
              <div className="mx-auto mb-6 size-20 rounded-full bg-gradient-to-br from-white to-zinc-100 p-5 text-secondary shadow dark:from-zinc-800 dark:to-zinc-900">
                {step.icon}
              </div>
              <h3 className="mb-4 text-3xl">
                {step.title}
              </h3>
              <p
                className="text-balance opacity-50"
                dangerouslySetInnerHTML={{ __html: step.description }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
