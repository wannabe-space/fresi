'use client'

import type { ReactElement } from 'react'
import { RiAddLine, RiCloseLine, RiHistoryLine, RiMenu2Fill } from '@remixicon/react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { FresiLogo } from '~/components/fresi-logo'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { UserButton } from '~/components/user-button'
import { useUser } from '~/hooks/use-user'
import { chatsListQuery } from '~/lib/query-keys'
import { cn } from '~/lib/ui'
import { useAppContext } from '../app-context'
import { SidebarHistory } from './components/sidebar-history'
import './sidebar.scss'

type Tab = 'history'
const DEFAULT_TAB: Tab = 'history'

const SidebarContext = createContext<{
  tab: Tab | null
  toggleTab: (newTab: Tab) => void
  closeTab: () => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
}>(null!)

export const useSidebarContext = () => useContext(SidebarContext)

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [tab, setTab] = useState<Tab | null>(null)
  const handlers = useSwipeable({
    onSwipedRight: () => setIsSidebarOpen(true),
  })

  function toggleTab(newTab: Tab) {
    setTab(tab === newTab ? null : newTab)
  }

  function closeTab() {
    setTab(null)
  }

  function toggleSidebar() {
    setIsSidebarOpen(isSidebarOpen => !isSidebarOpen)
  }

  function openSidebar() {
    setIsSidebarOpen(true)
  }

  function closeSidebar() {
    setIsSidebarOpen(false)
  }

  const { user } = useUser()

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        tab,
        toggleTab,
        closeTab,
        toggleSidebar,
      }}
    >
      <div
        className={cn('w-full relative flex', user && 'lg:pl-16')}
        onClick={closeTab}
      >
        {user && (
          <>
            <div {...handlers} className="fixed bottom-0 top-20 z-30 w-4 lg:hidden" />
            <Sidebar />
          </>
        )}
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { user } = useUser()
  const { toggleSidebar } = useSidebarContext()

  if (!user) {
    return null
  }

  return (
    <Button className={cn('lg:hidden', className)} variant="ghost" size="iconSm" onClick={toggleSidebar}>
      <RiMenu2Fill className="size-4" />
    </Button>
  )
}

function SidebarPanel({ className }: { className?: string }) {
  const queryClient = useQueryClient()
  const t = useTranslations('views.chat')
  const { tab: activeTab } = useSidebarContext()

  const tabs = {
    history: {
      label: t('chats-history'),
      component: SidebarHistory,
    },
  }

  const [title, setTitle] = useState(tabs[DEFAULT_TAB].label)
  const Component = useRef<() => ReactElement>(tabs[DEFAULT_TAB].component)

  useEffect(() => {
    if (activeTab) {
      setTitle(tabs[activeTab].label)
      Component.current = tabs[activeTab].component
    }
  }, [activeTab])

  useEffect(() => {
    queryClient.prefetchInfiniteQuery(chatsListQuery())
  }, [])

  return (
    <div
      className={cn(
        'lg:fixed flex flex-col z-20 duration-300 inset-y-2 will-change-transform w-full lg:w-80 lg:border rounded-lg border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900',
        activeTab ? 'lg:left-20 ease-out' : 'lg:-left-full ease-in',
        className,
      )}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <div className="flex h-14 w-full items-center p-5">
        <h3 key={title} className="w-full text-lg font-semibold">{title}</h3>
      </div>
      <Separator />
      <div className="flex-1 lg:overflow-y-auto">
        <Component.current />
      </div>
    </div>
  )
}

function SidebarHeader({ children }: { children: React.ReactNode }) {
  const { closeSidebar } = useSidebarContext()

  return (
    <div className="sticky top-0 z-30 flex w-full flex-col items-center bg-white dark:bg-zinc-900 lg:justify-center">
      <div className="flex h-14 w-full items-center justify-between p-4 lg:justify-center lg:p-2">
        <div className="flex items-center gap-4">
          <FresiLogo className="size-5 text-primary" />
          <span className="text-xl font-semibold lg:hidden">
            Fresi
          </span>
        </div>
        <Button
          variant="ghost"
          className="-mr-2 lg:hidden"
          size="iconSm"
          onClick={closeSidebar}
        >
          <RiCloseLine className="size-5" />
        </Button>
      </div>
      <Separator />
      {children}
    </div>
  )
}

function SidebarFooter({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('sticky bottom-0 z-30 w-full bg-white dark:bg-zinc-900 lg:justify-center lg:border-t-0', className)}
      {...props}
    >
      <Separator className="lg:hidden" />
      <div className="flex flex-col items-center gap-6">
        {children}
      </div>
    </div>
  )
}

export function Sidebar() {
  const t = useTranslations('views.chat')
  const pathname = usePathname()
  const { user } = useUser()
  const footerRef = useRef<HTMLDivElement>(null)
  const { isDesktop } = useAppContext()
  const { isSidebarOpen, toggleTab, closeTab, closeSidebar } = useSidebarContext()

  useEffect(() => {
    if (isDesktop) {
      closeSidebar()
      closeTab()
    }
  }, [isDesktop])

  return (
    <div
      className={cn(
        'fixed inset-y-2 -left-full lg:left-0 will-change-[left] z-30 max-w-[90%] w-80 lg:w-14 ml-2 duration-150',
        isSidebarOpen ? 'left-0 ease-out' : 'ease-in',
      )}
      onClick={() => closeTab()}
    >
      <div
        className={cn('fixed z-0 inset-0 bg-black/20 backdrop-blur-sm opacity-0 transition-opacity duration-150 pointer-events-none', isSidebarOpen && 'pointer-events-auto opacity-100')}
        onClick={closeSidebar}
      />
      <div className="relative flex size-full max-h-screen flex-col items-center justify-between overflow-y-auto rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900">
        <SidebarHeader>
          <div className="hidden w-full flex-col gap-1 p-2 lg:flex lg:items-center">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    href="/chat"
                    variant="ghost"
                    innerClassName="justify-start"
                    onClick={() => {
                      if (pathname === '/chat') {
                        document.getElementById('question')?.focus()
                      }
                    }}
                  >
                    <RiAddLine className="size-5" />
                    <span className="sr-only">{t('new-chat')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={20}>
                  {t('new-chat')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    innerClassName="justify-start"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleTab('history')
                    }}
                  >
                    <RiHistoryLine className="size-5" />
                    <span className="sr-only">{t('chats-history')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={20}>
                  {t('chats-history')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </SidebarHeader>
        <SidebarPanel className="flex-1" />
        <SidebarFooter ref={footerRef}>
          {user && (
            <div
              // eslint-disable-next-line tailwindcss/no-custom-classname
              className="sidebar-footer flex w-full items-center gap-4 overflow-hidden p-4 lg:w-auto lg:p-2"
            >
              <UserButton />
              <div className="flex flex-col lg:hidden">
                <span className="text-xs">{user.fullName}</span>
                <span className="text-xs">{user.primaryEmailAddress?.emailAddress}</span>
              </div>
            </div>
          )}
        </SidebarFooter>
      </div>
    </div>
  )
}
