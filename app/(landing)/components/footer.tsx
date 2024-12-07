import { RiGithubLine, RiTwitterXLine } from '@remixicon/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'
import { FresiLogo } from '~/components/fresi-logo'
import { REPOSITORY_URL, TWITTER_URL } from '~/lib/constants'

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="container pb-4">
      <div className="relative mt-10 overflow-hidden rounded-3xl border border-black/10 bg-white px-horizontal py-6 dark:border-white/10 dark:bg-zinc-900">
        <div className="relative z-20 flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="flex flex-col items-center justify-center gap-2 lg:flex-row">
            <div className="flex items-center">
              <FresiLogo className="me-4 size-6 text-primary" />
              <span className="mr-6 text-sm">
                ©
                {' '}
                {new Date().getFullYear()}
                {' '}
                Wannabe Space, LLC
              </span>
            </div>
            <div className="text-sm opacity-50">
              <Link href="/privacy-policy">
                {t('features.footer.privacy-policy')}
              </Link>
              {/* <small className="opacity-70">•</small>
              <Link href="/terms-conditions">
                {t('features.footer.terms-conditions')}
              </Link> */}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={TWITTER_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <RiTwitterXLine className="size-6" />
            </a>
            <a
              href={REPOSITORY_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <RiGithubLine className="size-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
