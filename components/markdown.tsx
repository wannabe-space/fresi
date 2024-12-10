'use client'

import type { ReactElement, ReactNode } from 'react'
import type { IOptions } from 'rehype-github-alerts'
import { RiFileCopyLine } from '@remixicon/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { rehypeGithubAlerts } from 'rehype-github-alerts'
import remarkGfm from 'remark-gfm'
import { useCopy } from '~/hooks/use-copy'
import { cn } from '~/lib/ui'
import { CodeHighlight } from './code-highlight'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

function Pre(props: { children?: ReactNode }) {
  const t = useTranslations('labels')
  const [rendered, setRendered] = useState(false)
  const { copyToClipboard } = useCopy()

  const childrenProps = (typeof props.children === 'object' && (props.children as ReactElement<{ children?: ReactNode, className?: string }>)?.props) || null
  const content = childrenProps?.children?.toString().trim() || null
  const lang = childrenProps?.className?.split('-')[1] || 'text'

  return (
    <div className="not-prose relative my-6 overflow-x-auto rounded-lg border border-black/10 bg-white p-2 text-sm first:mt-0 dark:border-white/10 dark:bg-zinc-900">
      <div className="absolute right-1 top-1">
        {rendered && content && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <RiFileCopyLine
                  className="size-6 p-1 text-zinc-400 dark:text-zinc-600"
                  onClick={() => copyToClipboard(content)}
                />
              </TooltipTrigger>
              <TooltipContent sideOffset={15}>
                {t('copy')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {content && (
        <CodeHighlight
          lines={lang !== 'text'}
          content={content}
          lang={lang}
          onRender={() => setRendered(true)}
        />
      )}
    </div>
  )
}

function Code({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <code
      className={cn(
        'not-prose text-sm bg-zinc-100 px-1 rounded-md dark:bg-zinc-900 border border-black/10 dark:border-white/10',
        className,
      )}
    >
      {children}
    </code>
  )
}

function A({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (props.href?.startsWith('http')) {
    return <a target="_blank" rel="noreferrer noopener" {...props} />
  }

  return <>{props.children}</>
}

// @ts-expect-error `node` from some plugin
function P({ children, className, node: _node, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={className} {...props}>{children}</p>
}

export function Markdown({
  className,
  content,
  animated: _animated,
}: {
  className?: string
  content: string
  animated?: boolean
}) {
  const t = useTranslations('alerts')
  const myOptions: IOptions = {
    alerts: [
      {
        keyword: 'NOTE',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
        title: t('note'),
      },
      {
        keyword: 'TIP',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>',
        title: t('tip'),
      },
      {
        keyword: 'IMPORTANT',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
        title: t('important'),
      },
      {
        keyword: 'WARNING',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
        title: t('warning'),
      },
      {
        keyword: 'CAUTION',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4" fill="currentColor"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25 6 2.25v4.7z"/></svg>',
        title: t('caution'),
      },
      {
        keyword: 'LEGACY',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4" fill="currentColor"><path d="M12 19.1642L18.2071 12.9571L16.7929 11.5429L12 16.3358L7.20712 11.5429L5.79291 12.9571L12 19.1642ZM12 13.5143L18.2071 7.30722L16.7929 5.89301L12 10.6859L7.20712 5.89301L5.79291 7.30722L12 13.5143Z"></path></svg>',
        title: t('legacy'),
      },
    ],
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeGithubAlerts.bind(null, myOptions)]}
      className={cn('prose prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl dark:prose-invert block', className)}
      components={{
        pre: Pre,
        code: Code,
        a: A,
        p: P,
      }}
      children={content}
    />
  )
}
