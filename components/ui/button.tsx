'use client'

import { RiLoader4Fill } from '@remixicon/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'motion/react'
import Link from 'next/link'
import * as React from 'react'
import { cn } from '~/lib/ui'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-900 dark:focus-visible:ring-zinc-300 [&>*]:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-zinc-50 shadow-xl shadow-primary/10 dark:text-zinc-900 hover-support:hover:bg-primary-dark dark:hover-support:hover:bg-primary-light',
        destructive:
          'bg-red-500 text-zinc-50 shadow-xl shadow-red-500/10 dark:bg-red-900 dark:text-zinc-50 hover-support:hover:bg-red-500/90 dark:hover-support:hover:bg-red-900/90',
        outline:
          'border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900 hover-support:hover:bg-zinc-100 hover-support:hover:text-zinc-800 dark:hover-support:hover:bg-zinc-800 dark:hover-support:hover:text-zinc-50',
        secondary:
          'bg-secondary text-zinc-50 shadow-xl shadow-secondary/10 dark:text-zinc-900 hover-support:hover:bg-secondary-dark',
        ghost:
          'hover-support:hover:bg-zinc-100 hover-support:hover:text-zinc-800 dark:hover-support:hover:bg-zinc-800 dark:hover-support:hover:text-zinc-50',
        link: 'text-zinc-800 no-underline underline-offset-2 dark:text-zinc-50 hover-support:hover:underline',
      },
      size: {
        default: 'h-10 rounded-lg px-5 py-2',
        xs: 'h-8 rounded-md px-3 text-sm',
        sm: 'h-9 rounded-md px-4',
        lg: 'h-11 rounded-lg px-6',
        icon: 'size-10 rounded-lg',
        iconSm: 'size-9 rounded-md',
        iconXs: 'size-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type OmitMotionProps<T> = Omit<T, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'style'>
type NativeButtonProps = OmitMotionProps<React.ButtonHTMLAttributes<HTMLButtonElement>> & { href?: string }

export type ButtonProps =
  NativeButtonProps &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
    innerClassName?: string
    target?: string
  }

const MotionLink = motion.create(Link)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    href,
    loading,
    children,
    innerClassName,
    target,
    type = 'button',
    ...props
  }, ref) => {
    const Component = href ? MotionLink : motion.button

    return (
      <Component
        // @ts-expect-error link it's not a button
        ref={ref}
        href={href}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={cn(buttonVariants({ variant, size, className }))}
        target={target}
        type={type}
        {...props}
      >

        <span className={cn(loading ? '-translate-y-1/2' : 'translate-y-10', 'duration-150 absolute left-1/2 top-1/2 -translate-x-1/2')}>
          <RiLoader4Fill
            className={cn(
              'animate-spin size-5',
              {
                'size-4': size === 'xs',
                'size-6': size === 'lg',
              },
            )}
          />
        </span>
        <span
          className={cn(
            'flex items-center duration-150 justify-center',
            size === 'icon' || size === 'iconSm' ? '' : 'w-full',
            size === 'xs' ? 'gap-1' : 'gap-2',
            loading ? '-translate-y-14' : 'translate-y-0',
            innerClassName,
          )}
        >
          {children}
        </span>
      </Component>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
