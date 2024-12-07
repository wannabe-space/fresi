import * as React from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { cn } from '~/lib/ui'

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextareaAutosize
        rows={1}
        className={cn(
          'flex w-full transition-all resize-none rounded-lg border border-black/10 bg-white px-4 py-3 ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed dark:border-white/10 dark:bg-zinc-900 dark:ring-offset-primary dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
