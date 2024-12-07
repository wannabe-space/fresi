'use client'

import { RiBardFill, RiChatAiFill, RiFileSearchFill, RiJavascriptFill, RiLink, RiStarFill } from '@remixicon/react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import { cn } from '~/lib/ui'

export function Features({ className, ...props }: Pick<React.ComponentProps<'div'>, 'className' | 'id'>) {
  const t = useTranslations('views.home.features')
  const ref = useRef<HTMLDivElement>(null)

  const description = t.markup('description', {
    span: chunks =>
      `<span style="position: relative; display: inline-block;">${chunks}<svg style="position: absolute; top: 0.8em; left: -5%; right: 0; pointer-events: none; width: 110%; height: 50%;" width="302" height="24" viewBox="0 0 302 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)"><mask id="b" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="302" height="24"><path d="M0 0h302v24H0V0Z" fill="#fff"/></mask><g mask="url(#b)"><path d="M1.395 14.488c67.58-3.218 148.198-7.21 216.884-9.971 11.85-.477 57.172-2.286 77.043-2.101 23.183.215-46.097 2.346-69.243 2.818-30.827.629-61.95.329-92.651 1.88C95.96 9.01 58.455 13.28 22.184 18.408c-4.77.674-9.893 1.389-14.445 2.445-.372.086.766.188 1.174.193 11.828.133 23.706-.053 35.497-.366 84.545-2.241 168.334-7.268 253.044-8.53" stroke="url(#c)" stroke-width="4" stroke-linecap="round"/></g></g><defs><linearGradient id="c" x1="300.013" y1=".564" x2="261.878" y2="107.487" gradientUnits="userSpaceOnUse"><stop offset=".002" stop-color="#16C2AD"/><stop offset=".5" stop-color="#63C4DA"/><stop offset="1" stop-color="#1675C2"/></linearGradient><clipPath id="a"><path fill="#fff" d="M0 0h302v24H0z"/></clipPath></defs></svg></span>`,
  })

  const list = [
    {
      title: t('docs-search.title'),
      description: t.markup('docs-search.description', {
        b: chunks => `<b>${chunks}</b>`,
      }),
      icon: <RiFileSearchFill className="size-full" />,
    },
    {
      title: t('sources.title'),
      description: t.markup('sources.description', {
        b: chunks => `<b>${chunks}</b>`,
      }),
      icon: <RiLink className="size-full" />,
    },
    {
      title: t('chat.title'),
      description: t.markup('chat.description', {
        b: chunks => `<b>${chunks}</b>`,
      }),
      icon: <RiChatAiFill className="size-full" />,
    },
    {
      title: t('ai-models.title'),
      description: t.markup('ai-models.description', {
        b: chunks => `<b>${chunks}</b>`,
      }),
      icon: <RiBardFill className="size-full" />,
    },
    {
      title: t('js-interface.title'),
      description: t.markup('js-interface.description', {
        b: chunks => `<b>${chunks}</b>`,
      }),
      icon: <RiJavascriptFill className="size-full" />,
    },
    {
      title: t('advantage.title'),
      description: t.markup('advantage.description', {
        b: chunks => `<b>${chunks}</b>`,
      }),
      icon: <RiStarFill className="size-full" />,
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
      <div
        ref={ref}
        className="mx-auto max-w-7xl text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-center text-subtitle font-semibold text-primary"
        >
          {t('title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0)', y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-16 max-w-5xl text-balance text-center text-h1 leading-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {list.map((feature, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              key={feature.title}
              className="relative rounded-3xl border border-black/10 bg-white px-4 py-8 duration-150 dark:border-white/10 dark:bg-zinc-900 lg:px-10 lg:py-12 hover-support:hover:scale-[1.02]"
            >
              <div
                className="mx-auto mb-6 size-20 rounded-full bg-gradient-to-br from-white to-zinc-100 p-5 text-secondary shadow dark:from-zinc-800 dark:to-zinc-900"
              >
                {feature.icon}
              </div>
              <h3 className="mb-4 text-3xl">
                {feature.title}
              </h3>
              <p
                className="text-balance opacity-50"
                dangerouslySetInnerHTML={{ __html: feature.description }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
