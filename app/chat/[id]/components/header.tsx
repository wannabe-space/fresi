import type { HTMLAttributes } from 'react'
import type { RouterOutputs } from '~/trpc/routers'
import { RiAddLine, RiHome2Line } from '@remixicon/react'
import { useTranslations } from 'next-intl'
import { DocIcon } from '~/components/doc-icon'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { UserAvatar } from '~/components/user-avatar'
import { useUser } from '~/hooks/use-user'
import { cn } from '~/lib/ui'
import { SidebarTrigger } from '../../sidebar'
import { ChatShare } from './share'

interface ChatHeaderProps extends HTMLAttributes<HTMLDivElement> {
  isShared: boolean
  chat: RouterOutputs['chats']['get'] | undefined
}

export function ChatHeader({ isShared, chat, className, ...props }: ChatHeaderProps) {
  const { user } = useUser()
  const t = useTranslations('views.chat')
  const resources = chat
    ? [...new Set(
        [
          ...chat.messages.map(m => m.docTypes).flat(),
          ...chat.messages.map(m => m.sources.map(s => s.docType)).flat(),
        ],
      )]
    : []

  return (
    <div
      className={cn('flex sticky top-0 h-16 z-10 pt-2 items-center justify-between gap-2 lg:gap-6 before:bg-gradient-to-b before:from-zinc-50 dark:before:from-zinc-950 before:to-transparent before:absolute before:inset-x-0 before:-z-10 before:h-28 before:pointer-events-none before:top-0', className)}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2 max-w-[calc(100%-5rem)] lg:max-w-[calc(100%-10rem)] lg:gap-4">
        <SidebarTrigger className="-ml-2 shrink-0" />
        {resources.map(resource => (
          <DocIcon key={resource} name={resource} />
        ))}
        {!!resources.length && <div className="h-4 w-px bg-black/10 dark:bg-white/10" />}
        {chat
          ? (
              <>
                <h1 className="truncate">{chat.title}</h1>
                {isShared && (
                  <>
                    <div className="h-4 w-px bg-black/10 dark:bg-white/10" />
                    <div className="flex items-center gap-2">
                      <UserAvatar className="size-5 rounded-sm" user={chat.user} />
                      <span className="text-balance text-xs leading-none text-gray-500 lg:text-sm">{t('shared-with-you')}</span>
                    </div>
                  </>
                )}
              </>
            )
          : <Skeleton className="h-7 w-2/3 max-w-60 dark:bg-zinc-900" />}
      </div>
      <div className="flex items-center gap-2 lg:gap-4">
        {chat
          ? (
              <>
                {!isShared && <ChatShare chatId={chat.id} initialPublic={chat.isPublic} />}
              </>
            )
          : <Skeleton className="size-9 dark:bg-zinc-900" />}
        {user
          ? (
              <Button className="lg:hidden" variant="outline" size="iconSm" href="/chat">
                <RiAddLine className="size-4" />
              </Button>
            )
          : (
              <Button variant="outline" size="iconSm" href="/">
                <RiHome2Line className="size-4" />
              </Button>
            )}
      </div>
    </div>
  )
}
