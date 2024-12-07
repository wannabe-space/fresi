'use client'

import { RiChat1Line, RiLoginCircleLine } from '@remixicon/react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useMeasure, useMountedState, useWindowSize } from 'react-use'
import { useAppContext } from '~/app/app-context'
import { FresiLogo } from '~/components/fresi-logo'
import { Button } from '~/components/ui/button'
import { UserButton } from '~/components/user-button'
import { useUser } from '~/hooks/use-user'
import { subscriptionCheckQuery } from '~/lib/query-keys'
import { cn, scrollTo } from '~/lib/ui'
import { NavbarLink } from './navbar-link'
import styles from './navbar.module.scss'

export function Navbar() {
  const t = useTranslations('navbar')
  const { scrollTop } = useAppContext()
  const [menuRef, { width: menuWidth }] = useMeasure<HTMLDivElement>()
  const { height: windowHeight } = useWindowSize()
  const isMounted = useMountedState()
  const { data: hasSubscription } = useQuery(subscriptionCheckQuery())

  const items = [
    {
      text: t('how-it-works'),
      selector: '#how-it-works',
    },
    {
      text: t('available'),
      selector: '#available',
    },
    {
      text: t('features'),
      selector: '#features',
    },
    {
      text: t('pricing'),
      selector: '#pricing',
    },
  ]

  // Sync with HomeHero.tsx
  const isScrolled
    = isMounted() && scrollTop > Math.min(windowHeight, 1000) - 70
  const isTopScrolled = isMounted() && scrollTop > 20

  const { user } = useUser()

  return (
    <header
      className={cn(
        'fixed inset-x-0 z-40 transition-[top] duration-300',
        isTopScrolled ? 'top-4' : 'top-10',
      )}
    >
      <nav className="container">
        {/* py no need in lg due to navbar link py */}
        <div className="relative mx-2 flex items-center justify-between px-4 py-2 lg:mx-4 lg:py-0">
          <div className="flex-1">
            <button
              className="flex cursor-pointer select-none items-center gap-3"
              onClick={() => scrollTo(0)}
            >
              <FresiLogo className="size-5 text-primary" />
              <h1 className="text-xl font-bold transition-colors duration-300 lg:text-2xl">
                <span className="leading-[0.8]">
                  Fresi
                </span>
              </h1>
            </button>
          </div>
          <div
            className={cn(
              'absolute inset-y-0 z-[-1] rounded-xl border backdrop-blur-md border-black/10 dark:border-white/10',
              styles.bg,
              isScrolled && 'scrolled',
              isMounted() && (menuWidth || isScrolled) ? 'opacity-100' : 'opacity-0 lg:opacity-0',
              isScrolled
                ? 'bg-white/100 dark:bg-zinc-900/50'
                : 'bg-white/30 dark:bg-zinc-900/30',
            )}
            style={{ width: isScrolled ? '100%' : `${menuWidth}px` }}
          />
          <div ref={menuRef} className="hidden justify-center lg:flex">
            <div
              className={cn(
                'flex px-6 duration-500',
                isMounted() ? 'opacity-100' : 'opacity-0',
              )}
            >
              {items.map(item => (
                <NavbarLink
                  key={item.text}
                  text={item.text}
                  className="p-4 transition-[color,padding] duration-300"
                  onClick={() => scrollTo(item.selector)}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 lg:gap-4">
            {user
              ? (
                  <>
                    {hasSubscription && (
                      <Button
                        href="/chat"
                        variant="link"
                      >
                        <RiChat1Line className="size-5" />
                        {t('chat')}
                      </Button>
                    )}
                    <UserButton />
                  </>
                )
              : (
                  <Button
                    href="/sign-up"
                    variant="link"
                  >
                    <RiLoginCircleLine className="size-5" />
                    {t('sign-up')}
                  </Button>
                )}
          </div>
        </div>
      </nav>
    </header>
  )
}
