import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '~/lib/ui'
import './code-highlight.scss'

let toHtml: typeof import('shiki').codeToHtml | null = null

interface CodeHighlightProps {
  content: string
  lang?: string
  lines?: boolean
  onRender?: (html: string) => void
  className?: string
}

export function CodeHighlight({ content, lang = 'bash', lines = false, onRender, className }: CodeHighlightProps) {
  const [html, setHtml] = useState<string | null>(null)
  const { resolvedTheme, setTheme } = useTheme()

  async function format(toHtml: typeof import('shiki').codeToHtml) {
    const html = await toHtml(content, {
      lang,
      theme: resolvedTheme === 'dark' ? 'github-dark' : 'github-light',
    })

    setHtml(html)
    onRender?.(html)
  }

  useEffect(() => {
    if (toHtml) {
      format(toHtml)
      return
    }

    // Static import will cause error in production
    import('shiki').then(async ({ codeToHtml }) => {
      toHtml ||= codeToHtml

      format(toHtml)
    })

    return () => {
      setHtml(null)
    }
  }, [content, lang, resolvedTheme, setTheme, onRender])

  if (html) {
    return (
      <div
        className={cn('overflow-x-auto', className, lines && 'lines')}
        data-lang={lang}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <pre
      className={cn(
        'shiki overflow-x-auto',
        !html && 'not-loaded animate-pulse text-zinc-500',
        className,
        lines && 'pl-8',
      )}
    >
      {content}
    </pre>
  )
}
