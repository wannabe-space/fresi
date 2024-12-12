import type { DocType } from '~/resources'
import Image from 'next/image'
import { cn } from '~/lib/ui'
import { resources } from '~/resources'

interface DocIconProps extends React.HTMLAttributes<HTMLImageElement> {
  name: DocType
  width?: number
  height?: number
}

export function DocIcon({ name, className, width = 20, height = 20, ...props }: DocIconProps) {
  const resource = resources.find(r => r.type === name)!

  return (
    <Image
      src={resource.icon}
      alt={resource.label}
      width={width}
      height={height}
      className={cn('size-4', [
        ['prisma', 'better-auth'].includes(name) && 'invert dark:invert-0',
        ['aisdk'].includes(name) && 'invert-0 dark:invert',
        className,
      ])}
      {...props}
    />
  )
}
