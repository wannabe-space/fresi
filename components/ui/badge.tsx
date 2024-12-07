import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '~/lib/ui'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-black/10 px-2.5 py-0.5 text-xs font-semibold transition-colors dark:border-white/10',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-zinc-50 dark:text-zinc-900',
        secondary:
          'border-transparent bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-50',
        destructive:
          'border-transparent bg-red-500 text-zinc-50 dark:bg-red-900 dark:text-zinc-50',
        outline: 'text-zinc-900 dark:text-zinc-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
