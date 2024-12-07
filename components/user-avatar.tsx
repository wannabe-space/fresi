import type { User } from '@clerk/nextjs/server'
import Image from 'next/image'
import React from 'react'
import { cn } from '~/lib/ui'

interface UserAvatarProps {
  user: Pick<User, 'emailAddresses' | 'imageUrl'> | null
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  if (!user) {
    return (
      <div
        className={cn(
          'flex size-8 items-center shrink-0 justify-center rounded-lg bg-gray-200',
          className,
        )}
      >
        N/A
      </div>
    )
  }

  if (user.imageUrl) {
    return (
      <div
        className={cn(
          'flex size-8 items-center shrink-0 justify-center overflow-hidden rounded-lg',
          className,
        )}
      >
        <Image
          src={user.imageUrl}
          className="size-full"
          alt={user.emailAddresses[0].emailAddress}
          width={100}
          height={100}
          unoptimized
        />
      </div>
    )
  }

  return (
    <button
      className={cn(
        'flex size-8 items-center shrink-0 justify-center rounded-lg bg-secondary',
        className,
      )}
    >
      {user.emailAddresses[0].emailAddress?.slice(0, 2)}
    </button>
  )
}
