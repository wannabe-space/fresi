import { RiArrowLeftLine } from '@remixicon/react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { BgVideo } from '~/components/bg-video'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations('views.auth')

  return (
    <div className="grid min-h-screen w-full grid-cols-1 overflow-hidden rounded-3xl p-4 lg:grid-cols-2 lg:p-6">
      <div className="flex flex-col items-center justify-between rounded-2xl border border-black/10 bg-white p-4  dark:border-white/10 dark:bg-zinc-900 lg:rounded-none lg:rounded-l-3xl lg:border-r-0 lg:p-6">
        <div />
        {children}
        <Link
          href="/"
          className="group mt-6 flex items-center gap-2 text-sm text-zinc-500"
        >
          <RiArrowLeftLine className="size-3 duration-150 group-hover:-translate-x-1" />
          {t('home')}
        </Link>
      </div>
      <div className="relative hidden overflow-hidden rounded-r-3xl lg:block">
        <div className="absolute inset-0 z-10 size-full">
          <BgVideo className="absolute inset-0 size-full scale-125" />
          <div className="absolute bottom-10 left-10 flex items-center justify-center">
            <div className="max-w-lg text-balance text-6xl font-bold text-white">
              {t('banner')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
