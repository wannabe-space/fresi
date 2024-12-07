'use client'

import { CHAT_CONTAINER_WIDTH_CLASS } from '~/app/chat/lib/constants'
import { cn } from '~/lib/ui'
import { FresiLogo } from './fresi-logo'
import { Skeleton } from './ui/skeleton'

const baseClasses = 'relative w-full flex gap-2 lg:gap-4 flex-col lg:flex-row'
const avatarBaseClasses = 'rounded-md size-7 min-w-7'

interface ChatUserProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar?: React.ReactNode
  skeleton?: boolean
}

export function ChatUser({ id, avatar, skeleton = false, className, children, ...props }: ChatUserProps) {
  return (
    <div id={id} className={cn(baseClasses, className)} {...props}>
      {skeleton && <Skeleton className={cn(avatarBaseClasses, 'dark:bg-zinc-900')} />}
      {!skeleton && avatar && (
        <div className={cn(avatarBaseClasses, 'overflow-hidden')}>
          {avatar}
        </div>
      )}
      {skeleton && <Skeleton className="h-7 w-full dark:bg-zinc-900 lg:w-1/3" />}
      {/* full - gap-4 (base gap) and size-7 (avatar) */}
      {!skeleton && <div className="max-w-full lg:max-w-[calc(100%-theme('spacing.4')-theme('size.7'))]">{children}</div>}
    </div>
  )
}

interface ChatAssistantProps extends React.HTMLAttributes<HTMLDivElement> {
  skeleton?: boolean
  avatarClassName?: string
  children?: React.ReactNode
}

export function ChatAssistant({ id, skeleton = false, className, avatarClassName, children, ...props }: ChatAssistantProps) {
  return (
    <div id={id} className={cn(baseClasses, className)} {...props}>
      {skeleton && <Skeleton className={cn(avatarBaseClasses, 'dark:bg-zinc-900')} />}
      {!skeleton && (
        <div
          className={cn(
            avatarBaseClasses,
            'flex items-center justify-center border border-zinc-200 bg-white text-primary dark:border-zinc-800 dark:bg-zinc-900',
            avatarClassName,
          )}
        >
          <FresiLogo className="size-3" />
        </div>
      )}
      {skeleton && <Skeleton className="h-44 w-full dark:bg-zinc-900" />}
      {/* full - gap-4 (base gap) and size-7 (avatar) */}
      {!skeleton && <div className="max-w-full lg:max-w-[calc(100%-theme('spacing.4')-theme('size.7'))]">{children}</div>}
    </div>
  )
}

interface ChatContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ChatContainer({ children, className, ...props }: ChatContainerProps) {
  return (
    <div className={cn('mx-auto flex w-full flex-col gap-6 lg:gap-10', CHAT_CONTAINER_WIDTH_CLASS, className)} {...props}>
      {children}
    </div>
  )
}
