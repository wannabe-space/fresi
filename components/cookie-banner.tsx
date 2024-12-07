'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use'
import { cn } from '~/lib/ui'
import { FresiLogo } from './fresi-logo'
import { Button } from './ui/button'

export function CookieBanner() {
  const tApp = useTranslations('app')
  const tLabels = useTranslations('labels')
  const [acceptCookies, setAcceptCookies] = useLocalStorage('accept-cookies', false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true)
    }, 0)
  }, [])

  return (
    <div className={cn(
      'fixed z-20 bottom-2 inset-x-0 transition-[transform,bottom] duration-150 pointer-events-none',
      acceptCookies || !isMounted ? 'translate-y-full bottom-0' : 'translate-y-0',
    )}
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-xl items-center justify-between gap-6 rounded-2xl border border-black/10 bg-white px-5 py-3 dark:border-white/10 dark:bg-zinc-900">
        <FresiLogo className="size-8 shrink-0 text-primary" />
        <span className="text-balance text-sm">
          {tApp('cookie')}
        </span>
        <Button className="shrink-0" size="sm" variant="outline" onClick={() => setAcceptCookies(true)}>
          {tLabels('accept')}
        </Button>
      </div>
    </div>
  )
}
