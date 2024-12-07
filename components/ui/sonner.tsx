'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-900 group-[.toaster]:border-black/10 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-zinc-900 dark:group-[.toaster]:text-zinc-50 dark:group-[.toaster]:border-white/10',
          description: 'group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400',
          actionButton:
            'group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-50 dark:group-[.toast]:bg-zinc-50 dark:group-[.toast]:text-zinc-800',
          cancelButton:
            'group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500 dark:group-[.toast]:bg-zinc-700 dark:group-[.toast]:text-zinc-400',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
