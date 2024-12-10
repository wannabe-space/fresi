'use client'

import type { ReactElement } from 'react'
import type { RouterOutputs } from '~/trpc/routers'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { RiDeleteBinFill, RiLoader4Fill, RiMoreFill } from '@remixicon/react'
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useClickAway } from 'react-use'
import { toast } from 'sonner'
import { useAppContext } from '~/app/app-context'
import { InView } from '~/components/in-view'
import { pushModal } from '~/components/modals'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Skeleton } from '~/components/ui/skeleton'
import { chatQuery, chatsListQuery, subscriptionCheckQuery } from '~/lib/query-keys'
import { cn } from '~/lib/ui'
import sadFaceAnimation from '~/lottie/sad-face.json'
import { trpc } from '~/trpc/client'
import { useSidebarContext } from '../sidebar'

function isLessThanDayAgo(date: string) {
  return dayjs().startOf('day').diff(dayjs(date).startOf('day'), 'day') < 1
}

function isLessThanYesterdayAgo(date: string) {
  return dayjs().startOf('day').diff(dayjs(date).startOf('day'), 'day') < 2
}

function isLessThanWeekAgo(date: string) {
  return dayjs().startOf('day').diff(dayjs(date).startOf('day'), 'day') < 7
}

function isLessThanMonthAgo(date: string) {
  return dayjs().startOf('day').diff(dayjs(date).startOf('day'), 'month') < 1
}

function isLessThanYearAgo(date: string) {
  return dayjs().startOf('day').diff(dayjs(date).startOf('day'), 'year') < 1
}

function formatData(data: RouterOutputs['chats']['list']) {
  let chatIdDay: string | null = null
  let chatIdYesterday: string | null = null
  let chatIdWeek: string | null = null
  let chatIdMonth: string | null = null
  let chatIdYear: string | null = null

  return data.map((chat) => {
    if (isLessThanDayAgo(chat.createdAt)) {
      if (!chatIdDay) {
        chatIdDay = chat.id
      }
    }
    else if (isLessThanYesterdayAgo(chat.createdAt)) {
      if (!chatIdYesterday) {
        chatIdYesterday = chat.id
      }
    }
    else if (isLessThanWeekAgo(chat.createdAt)) {
      if (!chatIdWeek) {
        chatIdWeek = chat.id
      }
    }
    else if (isLessThanMonthAgo(chat.createdAt)) {
      if (!chatIdMonth) {
        chatIdMonth = chat.id
      }
    }
    else if (isLessThanYearAgo(chat.createdAt)) {
      if (!chatIdYear) {
        chatIdYear = chat.id
      }
    }

    return {
      ...chat,
      showTodayLabel: chat.id === chatIdDay,
      showYesterdayLabel: chat.id === chatIdYesterday,
      showWeekLabel: chat.id === chatIdWeek,
      showMonthLabel: chat.id === chatIdMonth,
      showYearLabel: chat.id === chatIdYear,
    }
  })
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mx-3 mb-1 mt-4 block text-sm opacity-50 group-first:mt-0">{children}</div>
}

export function SidebarHistory(): ReactElement {
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const { isTouch } = useAppContext()
  const { closeTab, closeSidebar } = useSidebarContext()
  const router = useRouter()
  const { data: hasSubscription } = useQuery(subscriptionCheckQuery())
  const { data, fetchNextPage } = useInfiniteQuery({
    ...chatsListQuery(),
    getNextPageParam: (lastPage, allPages) => allPages.flatMap(data => data).length,
    select: data => formatData(data.pages.flat()),
  })
  const t = useTranslations('views.chat')
  const tLabels = useTranslations('labels')
  const [openedChatId, setOpenedChatId] = useState<string | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useClickAway(wrapperRef, () => {
    setOpenedChatId(null)
  })

  function removeChat(chatId: string) {
    pushModal('Remove', {
      text: t('remove-chat-confirm'),
      onConfirm: async () => {
        await trpc.chats.remove.mutate({ chatId })
        if (chatId === id) {
          closeTab()
          router.push('/chat')
        }
        queryClient.invalidateQueries(chatsListQuery())
      },
    })
  }

  // function getResources(chat: RouterOutputs['chats']['list'][number]) {
  //   return [...new Set(chat.messages.flatMap(message => message.sources).map(source => source.resource))]
  // }

  return (
    <div className="h-full px-2 py-4">
      {!data && (
        <div className="animate-pulse">
          {Array.from({ length: 15 }).map((_, index) => (
            <Skeleton className="mb-4 h-6 w-full" key={index} />
          ))}
        </div>
      )}
      {data?.map(chat => (
        <div className="group" key={chat.id}>
          {chat.showTodayLabel && <Label>{tLabels('today')}</Label>}
          {chat.showYesterdayLabel && <Label>{tLabels('yesterday')}</Label>}
          {chat.showWeekLabel && <Label>{tLabels('this-week')}</Label>}
          {chat.showMonthLabel && <Label>{tLabels('this-month')}</Label>}
          {chat.showYearLabel && <Label>{tLabels('this-year')}</Label>}
          <div
            className={cn(
              'group relative my-0.5 flex w-full justify-between duration-150 rounded-md hover-support:hover:bg-zinc-50 hover-support:dark:hover:bg-zinc-800',
              chat.id === id && 'bg-zinc-50 dark:bg-zinc-800',
            )}
            onMouseOver={() => {
              if (hasSubscription) {
                queryClient.prefetchQuery(chatQuery(chat.id))
              }
            }}
          >
            <Link
              href={`/chat/${chat.id}`}
              className={cn(
                'truncate px-3 w-full block text-left py-1 pe-8 lg:pe-0 hover-support:group-hover:pe-8',
                chat.id === openedChatId && 'lg:pe-8',
              )}
              onClick={(e) => {
                if (hasSubscription) {
                  closeTab()
                  closeSidebar()
                }
                else {
                  e.preventDefault()
                  toast.info(t('to-view-history-subscription-required'))
                }
              }}
            >
              {chat.title}
            </Link>
            <DropdownMenu onOpenChange={open => setOpenedChatId(open ? chat.id : null)}>
              <DropdownMenuTrigger
                className={cn(
                  'bg-zinc-50 dark:bg-zinc-800 before:bg-gradient-to-r flex p-1 right-1 inset-y-1 absolute w-6 items-center justify-center rounded-md duration-150 group-hover:opacity-100',
                  !isTouch && 'opacity-0',
                  openedChatId === chat.id && 'opacity-100',
                )}
              >
                <RiMoreFill className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-2 text-red-500"
                  onClick={() => removeChat(chat.id)}
                >
                  <RiDeleteBinFill className="size-4" />
                  {tLabels('remove')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
      {!!data && (
        <InView className="pb-5" onVisible={() => fetchNextPage()}>
          <RiLoader4Fill className="size-4 animate-spin" />
        </InView>
      )}
      {data?.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center gap-6">
          <DotLottieReact
            autoplay
            loop
            className="size-20 opacity-60 dark:opacity-20"
            data={sadFaceAnimation}
          />
          <span className="opacity-50">{t('empty-history')}</span>
        </div>
      )}
    </div>
  )
}
