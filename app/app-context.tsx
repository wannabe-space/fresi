'use client'

import { RiLoader4Fill } from '@remixicon/react'
import dayjs from 'dayjs'
import en from 'dayjs/locale/en'
import uk from 'dayjs/locale/uk'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import { useLocale } from 'next-intl'
import { createContext, useContext, useEffect, useState } from 'react'
import { useMedia } from 'react-use'
import { useSyncUser } from '~/hooks/use-user'
import { useZodConfig } from '~/hooks/use-zod-config'
import { cn } from '~/lib/ui'

dayjs.extend(relativeTime)
dayjs.extend(timezone)

const localeMap = {
  uk,
  en,
}

interface AppContextType {
  scrollTop: number
  isTouch: boolean
  isDesktop: boolean
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const AppContext = createContext<AppContextType>(null!)

export const useAppContext = () => useContext(AppContext)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [scrollTop, setScrollTop] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const locale = useLocale()
  const isDesktop = useMedia('(min-width: 1024px)', true)
  const [isMounted, setIsMounted] = useState(false)

  useZodConfig()
  useSyncUser()

  useEffect(() => {
    dayjs.locale(localeMap[locale as keyof typeof localeMap])
  }, [locale])

  useEffect(() => {
    setScrollTop(window.scrollY)
    window.addEventListener('scroll', () => {
      setScrollTop(window.scrollY)
    })
    setIsTouch(window.ontouchstart !== undefined)
    setIsMounted(true)
  }, [])

  return (
    <AppContext.Provider value={{ scrollTop, isTouch, isDesktop, isLoading, setIsLoading }}>
      {isMounted && (
        <div
          className={cn(
            'fixed inset-0 z-40 flex items-center duration-500 transition-opacity justify-center bg-zinc-50/80 backdrop-blur-sm dark:bg-zinc-950/80',
            isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
        >
          <RiLoader4Fill className="size-10 animate-spin" />
        </div>
      )}
      {children}
    </AppContext.Provider>
  )
}
