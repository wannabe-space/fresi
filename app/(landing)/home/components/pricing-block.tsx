import { RiCheckLine } from '@remixicon/react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { cn } from '~/lib/ui'

interface PricingBlockProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  description: string
  features: string[]
  title: React.ReactNode
  border?: boolean
  soon?: boolean
}

export function PricingBlock({
  description,
  features,
  title,
  border = false,
  soon = false,
  children,
  className,
}: PricingBlockProps) {
  const t = useTranslations('labels')

  return (
    <div
      className={cn('relative overflow-hidden max-w-xl mx-auto w-full rounded-[1.2rem] p-1', className)}
    >
      {soon && (
        <span className="absolute inset-0 z-30 flex items-center justify-center text-xl font-semibold">
          {t('soon')}
        </span>
      )}
      {border && (
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="size-[max(150vh,150vw)] animate-spin bg-gradient-to-r from-blue-500 to-green-500 [animation-duration:2s]" />
        </div>
      )}
      <div
        className={cn(
          'relative z-20 h-full rounded-2xl  bg-white p-5 lg:p-10 dark:bg-zinc-900',
          soon && '*:opacity-20 *:blur-md first:*:opacity-100 first:*:blur-none',
          !border && 'border border-black/10 dark:border-white/10',
        )}
      >
        <h3 className="mb-4 flex h-10 items-center justify-between text-3xl font-semibold">
          {title}
        </h3>
        <p className="mb-6 opacity-75 lg:mb-10">
          {description}
        </p>
        {children}
        <ul className="mt-8 opacity-75 lg:mt-14">
          {features.map(feature => (
            <li key={feature} className="mb-2 flex items-center gap-2">
              <RiCheckLine className="size-4 text-secondary" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
